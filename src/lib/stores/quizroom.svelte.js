import { browser } from '$app/environment';
import { POLL_MS } from '$lib/quiz-config.js';
import { fetchResponses, resetResponses, liveConfigured, tallyRoom } from '$lib/quiz.js';

/**
 * The room, as seen from the podium.
 *
 * Polls the database only while Scene 0 is on screen, so the rest of the
 * briefing makes no network calls at all. Every failure is absorbed: a request
 * that does not come back leaves the last good tally on screen, and a database
 * that never answers simply means `connected` stays false and the reveal drops
 * to its correct answer plus chimp line form.
 */
class QuizRoom {
	/** @type {any[]} raw rows, newest last */
	responses = $state([]);
	/** true once a GET has succeeded; false means show the degraded reveal */
	connected = $state(false);
	/** timestamp of the last successful wipe, drives the presenter's toast */
	clearedAt = $state(0);

	tally = $derived(tallyRoom(this.responses));

	_timer = null;
	_busy = false;

	/** A database URL exists in quiz-config.js. */
	get enabled() {
		return liveConfigured();
	}

	/** Room bars are only drawn when we have actually heard from the database. */
	get live() {
		return this.enabled && this.connected;
	}

	get count() {
		return this.responses.length;
	}

	start() {
		if (!browser || !this.enabled || this._timer) return;
		this.poll();
		this._timer = setInterval(() => this.poll(), POLL_MS);
	}

	stop() {
		clearInterval(this._timer);
		this._timer = null;
	}

	async poll() {
		if (this._busy) return;
		this._busy = true;
		const rows = await fetchResponses();
		// null is "we could not tell", which must not wipe the room mid reveal.
		if (rows) {
			this.responses = rows;
			this.connected = true;
		}
		this._busy = false;
	}

	/** The hidden shift+R shift+R wipe, between rehearsal and the briefing. */
	async reset() {
		if (!this.enabled) return;
		const ok = await resetResponses();
		if (!ok) return;
		this.responses = [];
		this.clearedAt = Date.now();
	}
}

export const room = new QuizRoom();
