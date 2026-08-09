/**
 * The single data access layer.
 *
 * Every JSON file is imported (not fetched) so it is bundled at build time:
 * the site works offline and no number can drift from the verified files.
 * The files in static/data are read only truth and are never modified here.
 */

import worldIndex from '$data/world_index.json';
import goalScoresWorld from '$data/goal_scores_world.json';
import regionsRaw from '$data/regions.json';
import dashboardCells from '$data/dashboard_cells.json';
import ranksRaw from '$data/ranks.json';
import countriesRaw from '$data/countries.json';
import povertyWorld from '$data/poverty_world.json';
import stats from '$data/derived_stats.json';

// Named `stats`, not `derived`: a module scope binding called `derived` would
// shadow the $derived rune inside every component that imports it.
export { worldIndex, goalScoresWorld, dashboardCells, povertyWorld, stats };

export const regionYears = regionsRaw.years;
export const regionSeries = regionsRaw.series;

export const countryYears = countriesRaw.years;
/** @type {Record<string, any>} */
export const countries = countriesRaw.countries;
export const countryNames = Object.keys(countries).sort((a, b) => a.localeCompare(b));

export const ranks = ranksRaw;

/** Short region label used in countries.json -> long label used in regions.json. */
export const REGION_SERIES_NAME = {
	OECD: 'OECD members',
	'Sub-Saharan Africa': 'Sub-Saharan Africa',
	'East & South Asia': 'East and South Asia',
	'E. Europe & C. Asia': 'Eastern Europe and Central Asia',
	MENA: 'Middle East and North Africa',
	LAC: 'Latin America and the Caribbean',
	Oceania: 'Oceania'
};

/** The six regional aggregates plus World, in the order used on the regions chart. */
export const REGION_LINES = [
	'OECD members',
	'Eastern Europe and Central Asia',
	'Latin America and the Caribbean',
	'East and South Asia',
	'Middle East and North Africa',
	'Sub-Saharan Africa',
	'Oceania'
];

/** Display labels for the regional lines: direct labels on curves, never a legend box. */
export const REGION_LABEL = {
	'OECD members': 'OECD',
	'Eastern Europe and Central Asia': 'E. Europe & C. Asia',
	'Latin America and the Caribbean': 'Latin America',
	'East and South Asia': 'East & South Asia',
	'Middle East and North Africa': 'Middle East & N. Africa',
	'Sub-Saharan Africa': 'Sub-Saharan Africa',
	Oceania: 'Oceania',
	World: 'World'
};

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

/** iso3 -> country name, for the URL hash comparison set. */
export const iso3ToName = /** @type {Record<string, string>} */ ({});
for (const [name, rec] of Object.entries(countries)) iso3ToName[rec.iso3] = name;

export const nameToIso3 = /** @type {Record<string, string>} */ ({});
for (const [name, rec] of Object.entries(countries)) nameToIso3[name] = rec.iso3;

/** name -> rank record, for the arrow chart. */
export const rankByName = /** @type {Record<string, any>} */ ({});
for (const r of ranks) rankByName[r.c] = r;

/* ------------------------------------------------------------------ */
/* Derived figures used in prose and annotations                       */
/* ------------------------------------------------------------------ */

/** Years remaining to the 2030 deadline, from the briefing date. */
export const YEARS_LEFT = 4;

/** Goal deltas 2015 to 2025 as an array indexed 1..17. */
export const goalDeltas = Array.from(
	{ length: 18 },
	(_, i) => stats.goal_delta_2015_2025[`goal${i}`] ?? null
);

/**
 * Trend percentages in derived_stats are computed over cells that have a
 * trend arrow, which excludes the 'na' cells. Exposed explicitly so the
 * waffle labels and the underlying counts can never disagree.
 */
export const trendDenominator = dashboardCells.filter((c) => c.t !== 'na').length;
export const dashDenominator = dashboardCells.length;

/** Counts straight from the cells, for anything that needs absolute numbers. */
export function countBy(key) {
	const out = {};
	for (const c of dashboardCells) out[c[key]] = (out[c[key]] ?? 0) + 1;
	return out;
}

export const dashCounts = countBy('d');
export const trendCounts = countBy('t');

/** World index score for a given year. */
export function worldScoreAt(year) {
	const i = worldIndex.years.indexOf(year);
	return i === -1 ? null : worldIndex.score[i];
}

/** Format helpers so rounding is consistent everywhere on the page. */
export const fmt1 = (n) => (n == null ? '—' : n.toFixed(1));
export const fmt2 = (n) => (n == null ? '—' : n.toFixed(2));
export const fmtSigned1 = (n) => (n == null ? '—' : (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toFixed(1));
export const fmtPct = (n) => (n == null ? '—' : `${Math.round(n)}%`);
