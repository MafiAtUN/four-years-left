/**
 * Consistency guard. Recomputes every headline figure from the raw verified
 * JSON, checks it against derived_stats.json, then checks that the prerendered
 * HTML actually contains the figures the talk depends on.
 *
 *   node scripts/verify-numbers.mjs
 *
 * Exits non zero if anything disagrees, so the page and the script can never
 * drift apart before the briefing.
 */
import { readFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const D = 'static/data/';

const stats = read(D + 'derived_stats.json');
const world = read(D + 'world_index.json');
const cells = read(D + 'dashboard_cells.json');
const countries = read(D + 'countries.json').countries;
const poverty = read(D + 'poverty_world.json');
const goals = read(D + 'goal_scores_world.json');
const ranks = read(D + 'ranks.json');

let fails = 0;
const near = (a, b, tol = 0.051) => Math.abs(a - b) <= tol;

function check(label, actual, expected, tol) {
	const ok = typeof expected === 'number' ? near(actual, expected, tol) : actual === expected;
	if (!ok) fails++;
	console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}: got ${actual}, expected ${expected}`);
}

console.log('— derived_stats.json against the raw files —');

const at = (y) => world.score[world.years.indexOf(y)];
check('world index 2000', at(2000), stats.world_2000);
check('world index 2015', at(2015), stats.world_2015);
check('world index 2025', at(2025), stats.world_2025);
check('pace 2015-2019', (at(2019) - at(2015)) / 4, stats.pace_2015_2019, 0.002);
check('pace 2019-2025', (at(2025) - at(2019)) / 6, stats.pace_2019_2025, 0.002);
check('gain last year', at(2025) - at(2024), stats.gain_last_year, 0.005);

// Ratings are shares of all cells; trends are shares of cells that have a trend.
const dashN = cells.length;
const trendN = cells.filter((c) => c.t !== 'na').length;
const cnt = (k, v) => cells.filter((c) => c[k] === v).length;
for (const [code, key] of [
	['g', 'green'],
	['y', 'yellow'],
	['o', 'orange'],
	['r', 'red'],
	['x', 'grey']
]) {
	check(`dashboard ${key} %`, +((cnt('d', code) / dashN) * 100).toFixed(1), stats.pct_dash[key]);
}
for (const [code, key] of [
	['up', 'up'],
	['mod', 'mod'],
	['flat', 'flat'],
	['down', 'down']
]) {
	check(`trend ${key} %`, +((cnt('t', code) / trendN) * 100).toFixed(1), stats.pct_trend[key]);
}

check('total cells', dashN, 2873);
check('ranked countries', Object.keys(countries).length, stats.ranked_countries);

// goal_scores_world.json is already rounded to 2dp, so subtracting its
// endpoints can land 0.1 away from derived_stats, which was computed from the
// unrounded series. derived_stats is the authority and is what the page shows;
// this only confirms the two never diverge by more than that rounding step.
for (let g = 1; g <= 17; g++) {
	const s = goals[`goal${g}`];
	check(
		`goal ${g} delta (±0.1 rounding)`,
		+(s.at(-1) - s[0]).toFixed(1),
		stats.goal_delta_2015_2025[`goal${g}`],
		0.101
	);
}

check('poverty 2000', +poverty.value[0].toFixed(1), stats.poverty_2000);
check('poverty latest', +poverty.value.at(-1).toFixed(1), stats.poverty_latest);
check(
	'2030 projection at current pace',
	+(at(2025) + stats.pace_2019_2025 * 5).toFixed(1),
	stats.projection_2030,
	0.06
);

console.log('\n— facts the talk asserts —');
const fin = countries['Finland'];
const us = countries['United States'];
const bd = countries['Bangladesh'];
check('Finland rank', fin.rank, 1);
check('Finland score', fin.score, 87.4);
check('Finland reds', fin.dash.filter((d) => d === 'r').length, 2);
check('US rank', us.rank, 45);
check('US 2015 rank', ranks.find((r) => r.c === 'United States').r15, 40);
check('US reds', us.dash.filter((d) => d === 'r').length, 7);
check('US greens', us.dash.filter((d) => d === 'g').length, 1);
check('US SDG 13 rating is red', us.dash[12], 'r');
check('Bangladesh SDG 13 rating is green', bd.dash[12], 'g');
check('Bangladesh rank now', bd.rank, 110);
check('Bangladesh rank 2015', ranks.find((r) => r.c === 'Bangladesh').r15, 118);
check(
	'countries on track for all 17 goals',
	Object.values(countries).filter((c) => c.trend.every((t) => t === 'up')).length,
	0
);

console.log('\n— figures present in the prerendered HTML —');
let html;
try {
	html = readFileSync('build/index.html', 'utf8');
} catch {
	console.log('  (no build/index.html yet, run npm run build first)');
	process.exit(fails ? 1 : 0);
}
const mustAppear = [
	['0.02', 'gain in the latest year'],
	['9.3', 'extreme poverty today'],
	['32.0', 'extreme poverty in 2000'],
	['87.4', 'Finland score'],
	['70.5', '2030 projection'],
	['+18.4', 'SDG 9 delta'],
	['152', 'SDG 16 decliners'],
	['2,873', 'dashboard cells'],
	['0.52', 'pace 2015-2019'],
	['0.31', 'pace 2019-2025']
];
for (const [needle, what] of mustAppear) {
	const ok = html.includes(needle);
	if (!ok) fails++;
	console.log(`${ok ? '  ok  ' : ' FAIL '} "${needle}" (${what}) in rendered HTML`);
}

console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\nAll checks passed.');
process.exit(fails ? 1 : 0);
