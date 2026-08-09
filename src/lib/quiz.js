/**
 * The quiz's data layer and its results transport.
 *
 * Questions are imported, not fetched, exactly like every other number on this
 * site: the phone page must work the instant it paints, on mobile data, with no
 * round trip. The only network calls the site ever makes are the three REST
 * calls below, and every one of them fails silently by design.
 */

import quizFile from '$data/quiz_questions.json';
import { QUIZ_DB } from './quiz-config.js';

export const QUIZ_META = quizFile.meta;
export const QUESTIONS = quizFile.questions;
export const N_QUESTIONS = QUESTIONS.length;
export const N_OPTIONS = QUIZ_META.options_per_question;

/* ------------------------------------------------------------------ */
/* Scoring, identical on the phone and on the big screen                */
/* ------------------------------------------------------------------ */

/** Number of correct answers in an answer array of option indexes. */
export function scoreOf(answers) {
	return QUESTIONS.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
}

/** The wire payload: five integers and a timestamp. Nothing else, ever. */
export function payloadOf(answers) {
	/** @type {Record<string, number>} */
	const out = {};
	QUESTIONS.forEach((q, i) => (out[q.id] = answers[i]));
	out.ts = Date.now();
	return out;
}

/* ------------------------------------------------------------------ */
/* Transport: plain REST against the Realtime Database, no SDK          */
/* ------------------------------------------------------------------ */

const root = () => (typeof QUIZ_DB === 'string' ? QUIZ_DB.trim().replace(/\/+$/, '') : '');

/** True when a database URL has been pasted into quiz-config.js. */
export const liveConfigured = () => root().length > 0;

/**
 * One request. Returns the parsed body on success and null on any failure at
 * all: no URL, offline, blocked, timed out, non 2xx, unparseable. Callers can
 * only ever see "we have data" or "we do not", which is what keeps the failure
 * modes off the screen.
 */
async function call(method, body, timeoutMs) {
	const base = root();
	if (!base || typeof fetch !== 'function') return null;

	const ctl = typeof AbortController === 'function' ? new AbortController() : null;
	const timer = ctl ? setTimeout(() => ctl.abort(), timeoutMs) : null;

	try {
		const res = await fetch(`${base}/responses.json`, {
			method,
			signal: ctl?.signal,
			...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {})
		});
		if (!res.ok) return null;
		const text = await res.text();
		if (!text) return null;
		try {
			return JSON.parse(text);
		} catch {
			return null;
		}
	} catch {
		return null;
	} finally {
		if (timer) clearTimeout(timer);
	}
}

/** Fire and forget from the phone. Resolves true only if the row landed. */
export async function submitResponse(answers) {
	const res = await call('POST', payloadOf(answers), 6000);
	return res != null;
}

/**
 * The room's responses as an array, or null if the database is unreachable.
 * Firebase returns an object keyed by push id, or the JSON null when empty,
 * so an empty room is [] and a broken link is null. The reveal needs to tell
 * those two apart.
 */
export async function fetchResponses() {
	const base = root();
	if (!base) return null;
	const res = await call('GET', null, 4000);
	if (res === null) return null;
	if (Array.isArray(res)) return res.filter(Boolean);
	if (typeof res === 'object') return Object.values(res).filter(Boolean);
	return null;
}

/** Wipe the room between rehearsal and the briefing. */
export async function resetResponses() {
	const base = root();
	if (!base) return false;
	await call('DELETE', null, 4000);
	return true;
}

/* ------------------------------------------------------------------ */
/* Tally, done client side so the database stays a dumb bucket          */
/* ------------------------------------------------------------------ */

/**
 * @param {any[]} responses raw rows
 * @returns per question counts and shares, plus the room's mean score
 */
export function tallyRoom(responses) {
	const perQuestion = QUESTIONS.map((q) => ({
		id: q.id,
		counts: Array(N_OPTIONS).fill(0),
		total: 0,
		shares: Array(N_OPTIONS).fill(0)
	}));

	let scoreSum = 0;
	let scored = 0;

	for (const row of responses ?? []) {
		if (!row || typeof row !== 'object') continue;
		let correct = 0;
		let answered = 0;
		QUESTIONS.forEach((q, i) => {
			const v = row[q.id];
			if (!Number.isInteger(v) || v < 0 || v >= N_OPTIONS) return;
			perQuestion[i].counts[v] += 1;
			perQuestion[i].total += 1;
			answered += 1;
			if (v === q.correct) correct += 1;
		});
		if (answered > 0) {
			scoreSum += correct;
			scored += 1;
		}
	}

	for (const q of perQuestion) {
		if (q.total > 0) q.shares = q.counts.map((c) => c / q.total);
	}

	return {
		perQuestion,
		count: (responses ?? []).length,
		scored,
		/** mean correct answers out of five, null when nobody has played */
		meanScore: scored > 0 ? scoreSum / scored : null,
		/** the same figure as a share, directly comparable to the chimp's 33 percent */
		meanShare: scored > 0 ? scoreSum / scored / N_QUESTIONS : null
	};
}
