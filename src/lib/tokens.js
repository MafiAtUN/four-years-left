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
