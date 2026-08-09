<script>
	import { scaleLinear } from 'd3-scale';
	import { line as d3line } from 'd3-shape';
	import Section from '$lib/components/Section.svelte';
	import Scroller from '$lib/components/Scroller.svelte';
	import CaptionCard from '$lib/components/CaptionCard.svelte';
	import ChartFrame from '$lib/components/ChartFrame.svelte';
	import Hl from '$lib/components/Hl.svelte';
	import { goalScoresWorld, stats, goalDeltas, fmtSigned1 } from '$lib/data';
	import { SDG, GOAL_NAMES, GOAL_SHORT, RULE } from '$lib/tokens';

	let index = $state(0);
	let w = $state(900);
	let h = $state(600);

	const years = goalScoresWorld.years;
	const goals = Array.from({ length: 17 }, (_, i) => ({
		n: i + 1,
		name: GOAL_NAMES[i + 1],
		color: SDG[i + 1],
		values: goalScoresWorld[`goal${i + 1}`],
		delta: goalDeltas[i + 1]
	}));

	// Steps: all grey, small multiples, then the three spotlights.
	const SPOTLIGHT = [null, null, 9, 2, 16];
	const spot = $derived(SPOTLIGHT[index] ?? null);
	const isGrid = $derived(index === 1);

	const allValues = goals.flatMap((g) => g.values);
	const yLo = Math.floor(Math.min(...allValues) / 10) * 10;
	const yHi = Math.ceil(Math.max(...allValues) / 10) * 10;

	/* --- single frame geometry ------------------------------------ */
	const m = { top: 20, right: 190, bottom: 44, left: 52 };
	const iw = $derived(Math.max(100, w - m.left - m.right));
	const ih = $derived(Math.max(100, h - m.top - m.bottom));
	const x = $derived(scaleLinear().domain([years[0], years.at(-1)]).range([0, iw]));
	const y = $derived(scaleLinear().domain([yLo, yHi]).range([ih, 0]));
	const mk = $derived(
		d3line()
			.defined((v) => v != null)
			.x((_, i) => x(years[i]))
			.y((v) => y(v))
	);

	/* --- small multiples geometry, 5 columns by 4 rows ------------- */
	const GC = 5;
	const GR = 4;
	const gm = { top: 30, right: 14, bottom: 22, left: 22 };
	const cellW = $derived(Math.max(60, (w - 16) / GC));
	const cellH = $derived(Math.max(50, (h - 8) / GR));
	const pw = $derived(Math.max(24, cellW - gm.left - gm.right));
	const ph = $derived(Math.max(20, cellH - gm.top - gm.bottom));
	const gx = $derived(scaleLinear().domain([years[0], years.at(-1)]).range([0, pw]));
	const gy = $derived(scaleLinear().domain([yLo, yHi]).range([ph, 0]));
	const gmk = $derived(
		d3line()
			.x((_, i) => gx(years[i]))
			.y((v) => gy(v))
	);

	const titles = [
		'The average hides seventeen different stories',
		'Seventeen goals, seventeen trajectories',
		'Innovation and infrastructure is the decade’s biggest win',
		'Hunger is the goal that went backwards',
		'Peace and institutions is in retreat worldwide'
	];

	const opacityOf = (g) => (spot == null ? 0.55 : g.n === spot ? 1 : 0.12);
	const strokeOf = (g) => (spot == null ? '#9AA4B2' : g.n === spot ? g.color : '#C7CDD6');
</script>

<Section scene={5} id="seventeen" label="Seventeen goals">
	<Scroller
		scene={5}
		count={5}
		bind:index
		labels={['All goals', 'Small multiples', 'SDG 9', 'SDG 2', 'SDG 16']}
	>
		{#snippet chart(i)}
			<div class="stage" class:grid-stage={isGrid}>
				<div class="chart-col">
					<ChartFrame
						title={titles[index]}
						subtitle={isGrid
							? `World score for each of the 17 goals, 2015 to 2025. All panels share one ${yLo} to ${yHi} scale, and the number is the change since 2015.`
							: 'World score for each of the 17 goals, 0 to 100, 2015 to 2025.'}
						accent={spot ? SDG[spot] : 'var(--color-un-blue)'}
					>
						<div class="plot" bind:clientWidth={w} bind:clientHeight={h}>
							{#if isGrid}
								<!-- Small multiples: the Atlas shrink into a grid move. -->
								<svg width={w} height={h} role="img" aria-label="Seventeen goal scores as small multiples">
									{#each goals as g, k}
										{@const col = k % GC}
										{@const row = Math.floor(k / GC)}
										<g transform="translate({col * cellW + gm.left},{row * cellH + gm.top})">
											<rect x="0" y="0" width={pw} height={ph} fill="var(--color-paper-alt)" />
											<text class="panel-title" x="0" y="-8" fill={g.color}>
												{g.n}. {GOAL_SHORT[g.n]}
											</text>
											<text class="panel-delta tabular" x={pw} y={-8} text-anchor="end" fill={g.color}>
												{fmtSigned1(g.delta)}
											</text>
											<path d={gmk(g.values)} fill="none" stroke={g.color} stroke-width="2.5" />
										</g>
									{/each}
								</svg>
							{:else}
								<svg width={w} height={h} role="img" aria-label={titles[index]}>
									<g transform="translate({m.left},{m.top})">
										{#each y.ticks(5) as t}
											<line x1="0" x2={iw} y1={y(t)} y2={y(t)} stroke={RULE} stroke-dasharray="2 4" />
											<text class="tick" x="-12" y={y(t)} dy="0.32em" text-anchor="end">{t}</text>
										{/each}
										{#each [2015, 2018, 2021, 2025] as t}
											<text class="tick" x={x(t)} y={ih + 28} text-anchor="middle">{t}</text>
										{/each}

										{#each goals as g}
											<path
												d={mk(g.values)}
												fill="none"
												stroke={strokeOf(g)}
												stroke-width={g.n === spot ? 5 : 2}
												opacity={opacityOf(g)}
												style="transition:opacity 500ms ease, stroke 500ms ease, stroke-width 500ms ease"
											/>
										{/each}

										<!-- direct label on the spotlit curve, never a legend box -->
										{#each goals as g}
											{#if g.n === spot}
												<circle cx={x(years.at(-1))} cy={y(g.values.at(-1))} r="6" fill={g.color} />
												<text class="direct" x={x(years.at(-1)) + 12} y={y(g.values.at(-1))} dy="-2" fill={g.color}>
													SDG {g.n}
												</text>
												<text class="direct-sub" x={x(years.at(-1)) + 12} y={y(g.values.at(-1))} dy="20">
													{fmtSigned1(g.delta)} since 2015
												</text>
											{/if}
										{/each}
									</g>
								</svg>
							{/if}
						</div>
					</ChartFrame>
				</div>
			</div>
		{/snippet}

		{#snippet step(i)}
			<CaptionCard
				accent={SPOTLIGHT[i] ? SDG[SPOTLIGHT[i]] : 'var(--color-un-blue)'}
				eyebrow={['All seventeen', 'Goal by goal', 'SDG 9', 'SDG 2', 'SDG 16'][i]}
				active={i === index}
			>
				{#if i === 0}
					The world index is an average, and averages lie. Underneath it are seventeen goals moving
					at seventeen different speeds.
				{:else if i === 1}
					Seen separately, most goals climb gently, a few climb steeply, and a few bend the wrong
					way. The numbers show each goal's change since 2015.
				{:else if i === 2}
					<Hl c={SDG[9]}>Innovation and infrastructure rose {fmtSigned1(goalDeltas[9])} points</Hl>
					since 2015, the biggest gain of any goal, driven mostly by connectivity.
				{:else if i === 3}
					<Hl c={SDG[2]}>Hunger has gone slightly backwards, {fmtSigned1(goalDeltas[2])} points</Hl>.
					The world is not merely failing to end hunger fast enough; it has lost ground.
				{:else}
					<Hl c={SDG[16]}>Peace and institutions fell {fmtSigned1(goalDeltas[16])} points</Hl>,
					declining in {stats.sdg16_decliners} of {stats.sdg16_total} countries. The goals we are
					failing are not the technical ones.
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
		max-width: 1150px;
	}

	.plot {
		width: 100%;
		height: 100%;
		min-height: 260px;
	}

	.panel-title {
		font-size: var(--text-micro);
		font-weight: 700;
		font-family: var(--font-body);
	}

	.panel-delta {
		font-size: var(--text-micro);
		font-weight: 700;
		font-family: var(--font-body);
	}

	.direct {
		font-size: 22px;
		font-weight: 800;
		font-family: var(--font-display);
	}

	.direct-sub {
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
