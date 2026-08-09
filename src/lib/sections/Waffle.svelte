<script>
	import Section from '$lib/components/Section.svelte';
	import Scroller from '$lib/components/Scroller.svelte';
	import CaptionCard from '$lib/components/CaptionCard.svelte';
	import ChartFrame from '$lib/components/ChartFrame.svelte';
	import Hl from '$lib/components/Hl.svelte';
	import {
		dashboardCells,
		stats,
		dashCounts,
		trendCounts,
		trendDenominator,
		dashDenominator,
		fmtPct
	} from '$lib/data';
	import { DASH, DASH_LABEL, TREND_COLOR, TREND_LABEL } from '$lib/tokens';

	let index = $state(0);
	let w = $state(900);
	let h = $state(600);

	const N = dashboardCells.length; // 2873

	/** Deterministic shuffle: the server and the client must agree, or the
	    scattered state would flicker on hydration. */
	function mulberry32(a) {
		return function () {
			a |= 0;
			a = (a + 0x6d2b79f5) | 0;
			let t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const DASH_ORDER = ['g', 'y', 'o', 'r', 'x'];
	const TREND_ORDER = ['up', 'mod', 'flat', 'down', 'na'];

	// Three arrangements of the same 2873 cells. Emphasis by rearrangement.
	const scattered = (() => {
		const rnd = mulberry32(20260809);
		const slots = [...Array(N).keys()];
		for (let i = slots.length - 1; i > 0; i--) {
			const j = Math.floor(rnd() * (i + 1));
			[slots[i], slots[j]] = [slots[j], slots[i]];
		}
		return slots; // cell i sits at slot scattered[i]
	})();

	const byRating = (() => {
		const order = [...Array(N).keys()].sort(
			(a, b) =>
				DASH_ORDER.indexOf(dashboardCells[a].d) - DASH_ORDER.indexOf(dashboardCells[b].d) ||
				a - b
		);
		const slot = new Array(N);
		order.forEach((cellIdx, s) => (slot[cellIdx] = s));
		return slot;
	})();

	const byTrend = (() => {
		const order = [...Array(N).keys()].sort(
			(a, b) =>
				TREND_ORDER.indexOf(dashboardCells[a].t) - TREND_ORDER.indexOf(dashboardCells[b].t) ||
				a - b
		);
		const slot = new Array(N);
		order.forEach((cellIdx, s) => (slot[cellIdx] = s));
		return slot;
	})();

	const slots = $derived(index === 0 ? scattered : index === 1 ? byRating : byTrend);
	const colorOf = $derived((cell) => (index === 2 ? TREND_COLOR[cell.t] : DASH[cell.d]));

	/* --- geometry ------------------------------------------------- */
	const pad = { top: 8, right: 300, bottom: 8, left: 8 };
	const gridW = $derived(Math.max(120, w - pad.left - pad.right));
	const gridH = $derived(Math.max(120, h - pad.top - pad.bottom));

	// Columns follow the plot's aspect ratio so the block of 2,873 squares
	// fills the frame instead of floating in the top third of it.
	const COLS = $derived(
		Math.max(30, Math.min(96, Math.round(Math.sqrt((N * gridW) / gridH))))
	);
	const ROWS = $derived(Math.ceil(N / COLS));
	const cell = $derived(Math.max(2, Math.min(gridW / COLS, gridH / ROWS)));
	const size = $derived(Math.max(1.5, cell * 0.82));

	const px = $derived((slot) => (slot % COLS) * cell);
	const py = $derived((slot) => Math.floor(slot / COLS) * cell);

	/** Band labels sit beside the block they name: direct labels, no legend box. */
	const bands = $derived.by(() => {
		if (index === 0) return [];
		const order = index === 1 ? DASH_ORDER : TREND_ORDER;
		const counts = index === 1 ? dashCounts : trendCounts;
		const denom = index === 1 ? dashDenominator : trendDenominator;
		let acc = 0;
		const out = [];
		for (const k of order) {
			const n = counts[k] ?? 0;
			if (!n) continue;
			const start = acc;
			acc += n;
			// Trend percentages exclude the 'na' cells, matching derived_stats.json.
			const pct = index === 2 && k === 'na' ? null : (n / denom) * 100;
			out.push({
				k,
				n,
				pct,
				color: index === 1 ? DASH[k] : TREND_COLOR[k],
				label: index === 1 ? DASH_LABEL[k] : TREND_LABEL[k],
				midRow: (start + n / 2) / COLS
			});
		}
		return out;
	});

	const titles = [
		'Every country, every goal: 2,873 ratings',
		'Seven percent of the world’s report card is green',
		'Half of all goal trends are going nowhere'
	];
</script>

<Section scene={4} id="report-card" label="The report card">
	<Scroller
		scene={4}
		count={3}
		bind:index
		labels={['All ratings', 'Sorted by rating', 'Direction of travel']}
	>
		{#snippet chart(i)}
			<div class="stage">
				<div class="chart-col">
					<ChartFrame
						title={titles[index]}
						subtitle="One square per country and goal: {N.toLocaleString('en')} ratings across 169 countries and 17 goals, Sustainable Development Report 2026."
						accent="var(--color-dash-red)"
					>
						<div class="plot" bind:clientWidth={w} bind:clientHeight={h}>
							<svg width={w} height={h} role="img" aria-label={titles[index]}>
								<g transform="translate({pad.left},{pad.top})">
									{#each dashboardCells as c, k (k)}
										<rect
											width={size}
											height={size}
											rx={size > 5 ? 1 : 0}
											fill={colorOf(c)}
											transform="translate({px(slots[k])},{py(slots[k])})"
											style="transition: transform 900ms cubic-bezier(.4,0,.2,1) {(k %
												37) *
												6}ms, fill 500ms ease"
										/>
									{/each}

									{#each bands as b}
										<g
											transform="translate({COLS * cell + 18},{b.midRow * cell})"
											style="transition:transform 700ms ease"
										>
											<text class="band-pct tabular" x="0" y="0" fill={b.color}>
												{b.pct == null ? `${b.n}` : fmtPct(b.pct)}
											</text>
											<text class="band-label" x="0" y="24">{b.label}</text>
										</g>
									{/each}
								</g>
							</svg>
						</div>
					</ChartFrame>
				</div>
			</div>
		{/snippet}

		{#snippet step(i)}
			<CaptionCard
				accent={i === 2 ? TREND_COLOR.flat : i === 1 ? DASH.r : 'var(--color-ink-muted)'}
				eyebrow={['2,873 ratings', 'Sorted by rating', 'Direction of travel'][i]}
				active={i === index}
			>
				{#if i === 0}
					The Sustainable Development Report rates every country on every goal. Here is the whole
					world's report card, one square at a time, in no particular order.
				{:else if i === 1}
					Sorted, the verdict is stark: only <Hl c={DASH.g}>{fmtPct(stats.pct_dash.green)} are green</Hl
					>, while <Hl c={DASH.r}>{fmtPct(stats.pct_dash.red)} are red</Hl> — major challenges
					remaining.
				{:else}
					Direction matters more than level: <Hl c={TREND_COLOR.flat}
						>{fmtPct(stats.pct_trend.flat)} are stagnating</Hl
					>
					and <Hl c={TREND_COLOR.down}>{fmtPct(stats.pct_trend.down)} are reversing</Hl>. Only
					<Hl c={TREND_COLOR.up}>{fmtPct(stats.pct_trend.up)}</Hl> are on track.
				{/if}
			</CaptionCard>
		{/snippet}
	</Scroller>
</Section>

<style>
	.stage {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		padding: clamp(20px, 4vh, 48px) clamp(24px, 4vw, 56px);
		padding-left: clamp(24px, 36vw, 560px);
	}

	.chart-col {
		width: 100%;
		height: 100%;
		max-width: 1200px;
	}

	.plot {
		width: 100%;
		height: 100%;
		min-height: 260px;
	}

	.band-pct {
		font-size: 34px;
		font-weight: 800;
		font-family: var(--font-display);
	}

	.band-label {
		font-size: var(--text-tick);
		fill: var(--color-ink-muted);
		font-family: var(--font-body);
	}

	@media (max-width: 900px) {
		.stage {
			padding-left: clamp(16px, 4vw, 24px);
			align-items: flex-start;
			padding-top: 7vh;
		}
	}
</style>
