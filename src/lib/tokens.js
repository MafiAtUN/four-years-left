/**
 * Design tokens for code that cannot read CSS variables:
 * canvas 2D, SVG fill attributes, d3 scales.
 * Mirrors src/app.css @theme. Change both together.
 */

export const NAVY = '#0B1B3F';
export const NAVY_700 = '#16294F';
export const UN_BLUE = '#009EDB';
export const INK = '#16202E';
export const INK_MUTED = '#5B6675';
export const RULE = '#D8DEE7';

/** Dashboard rating scale, keyed by the codes used in the data files. */
export const DASH = {
	g: '#2EA043',
	y: '#F5C518',
	o: '#F58220',
	r: '#D64545',
	x: '#B0B7C3'
};

/** Human labels for the dashboard codes. */
export const DASH_LABEL = {
	g: 'Goal achieved',
	y: 'Challenges remain',
	o: 'Significant challenges',
	r: 'Major challenges',
	x: 'Data not available'
};

/** Trend arrow codes used in the data files. */
export const TREND_LABEL = {
	up: 'On track',
	mod: 'Moderately improving',
	flat: 'Stagnating',
	down: 'Decreasing',
	na: 'Trend not available'
};

export const TREND_GLYPH = {
	up: '↑',
	mod: '↗',
	flat: '→',
	down: '↓',
	na: '·'
};

/** Pace coding for the stall chart line segments. */
export const PACE = {
	fast: '#009EDB',
	slow: '#F5C518',
	flat: '#D64545'
};

/** Comparison slot colors, in fixed order. */
export const SLOT_COLORS = ['#8E44AD', '#00A6A6', '#D81B60'];

/** Official UN SDG palette, index 1 to 17. Index 0 is unused. */
export const SDG = [
	null,
	'#E5243B',
	'#DDA63A',
	'#4C9F38',
	'#C5192D',
	'#FF3A21',
	'#26BDE2',
	'#FCC30B',
	'#A21942',
	'#FD6925',
	'#DD1367',
	'#FD9D24',
	'#BF8B2E',
	'#3F7E44',
	'#0A97D9',
	'#56C02B',
	'#00689D',
	'#19486A'
];

/** Short goal titles, index 1 to 17. */
export const GOAL_NAMES = [
	null,
	'No Poverty',
	'Zero Hunger',
	'Good Health and Well-being',
	'Quality Education',
	'Gender Equality',
	'Clean Water and Sanitation',
	'Affordable and Clean Energy',
	'Decent Work and Economic Growth',
	'Industry, Innovation and Infrastructure',
	'Reduced Inequalities',
	'Sustainable Cities and Communities',
	'Responsible Consumption and Production',
	'Climate Action',
	'Life Below Water',
	'Life on Land',
	'Peace, Justice and Strong Institutions',
	'Partnerships for the Goals'
];

/** Five step UN blue ramp for the choropleth, low score to high. */
export const BLUE_RAMP = ['#D6EAF6', '#A5D2EC', '#66B4E0', '#2A90CC', '#00618F'];

export const SOURCE_LINE =
	'Sustainable Development Report 2026, SDG Index database (Fuller, Iablonovski, Lafortune and Sachs).';

/** Trend arrow colors for the waffle's direction of travel state. */
export const TREND_COLOR = {
	up: '#1B7F3B',
	mod: '#7CBF6B',
	flat: '#F5C518',
	down: '#D64545',
	na: '#B0B7C3'
};

/** Regional line colors. Direct labels carry the meaning; these only separate. */
export const REGION_COLOR = {
	'OECD members': '#1F4E79',
	'Eastern Europe and Central Asia': '#7B6CA6',
	'Latin America and the Caribbean': '#C06C34',
	'East and South Asia': '#2E8B77',
	'Middle East and North Africa': '#A8763E',
	'Sub-Saharan Africa': '#B5446E',
	Oceania: '#6B7A8F',
	World: '#16202E'
};

/** Approximate centroids for the nine ranked microstates with no polygon at 110m. */
export const MICROSTATES = {
	Malta: [14.4, 35.9],
	Singapore: [103.8, 1.35],
	Maldives: [73.5, 3.2],
	Barbados: [-59.5, 13.1],
	'Cabo Verde': [-23.6, 15.1],
	Mauritius: [57.5, -20.3],
	Bahrain: [50.6, 26.0],
	'Sao Tome and Principe': [6.6, 0.3],
	Comoros: [43.3, -11.6]
};

/** Fixed bins for the choropleth, matching the five step blue ramp. */
export const SCORE_BINS = [50, 60, 70, 80];
export function scoreBin(score) {
	if (score == null) return -1;
	let i = 0;
	while (i < SCORE_BINS.length && score >= SCORE_BINS[i]) i++;
	return i;
}

/** Short goal labels for small multiples and tight tiles, index 1 to 17. */
export const GOAL_SHORT = [
	null,
	'Poverty',
	'Hunger',
	'Health',
	'Education',
	'Gender',
	'Water',
	'Energy',
	'Work',
	'Industry',
	'Inequality',
	'Cities',
	'Consumption',
	'Climate',
	'Oceans',
	'Land',
	'Peace',
	'Partnerships'
];

/**
 * Hero particle ramp. The choropleth ramp runs dark at the top end, which
 * disappears against the navy, so the hero gets its own light ramp keyed to
 * the same five score bins.
 */
export const HERO_RAMP = ['#4F7BB0', '#3F9BD6', '#35B8EC', '#79D8F5', '#CDF3FF'];

/**
 * Text safe variants of the series colors.
 *
 * Several palette colors are far too light to read as text on white: the
 * yellows sit near 1.6:1. Charts keep the true color, but a caption highlight
 * or an eyebrow is text, so it uses the darkened variant of the same hue. The
 * word still reads as "the yellow series" while clearing WCAG AA.
 */
export const TEXT_SAFE = {
	'#F5C518': '#8A6D00', // dashboard yellow / pace slowing
	'#FCC30B': '#8A6D00', // SDG 7
	'#DDA63A': '#8A6512', // SDG 2
	'#BF8B2E': '#7A5814', // SDG 12
	'#FD6925': '#C24405', // SDG 9
	'#F58220': '#A85400', // dashboard orange
	'#FD9D24': '#9A5A00', // SDG 11
	'#FF3A21': '#C42C10', // SDG 5
	'#009EDB': '#0A6E9B', // UN blue / pace fast
	'#0A97D9': '#0A6E9B', // SDG 14
	'#26BDE2': '#0E7C99', // SDG 6
	'#D64545': '#B22222', // dashboard red / pace flat
	'#2EA043': '#1B7F3B', // dashboard green
	'#56C02B': '#3E8C1B', // SDG 15
	'#4C9F38': '#357026', // SDG 3
	'#7CBF6B': '#4A7C3C', // trend moderately improving
	'#B0B7C3': '#5B6675' // dashboard grey
};

/** Darkened twin of a series color for use as text, or the color unchanged. */
export function textSafe(c) {
	if (typeof c !== 'string') return c;
	return TEXT_SAFE[c.toUpperCase()] ?? c;
}
