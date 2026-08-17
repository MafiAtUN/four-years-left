<script>
	import { scaleLinear } from 'd3-scale';
	import { line as d3line, area as d3area } from 'd3-shape';
	import Section from '$lib/components/Section.svelte';
	import ChartFrame from '$lib/components/ChartFrame.svelte';
	import { worldIndex, stats, fmt1 } from '$lib/data';
	import { PACE, RULE, UN_BLUE } from '$lib/tokens';

	let w = $state(1000);
	let h = $state(520);

	const years = worldIndex.years;
	const score = worldIndex.score;
	const last = score.at(-1);
	const lastYear = years.at(-1);

	// Two futures, both drawn from the verified paces rather than typed in.
	const proj = [];
	const promised = [];
	for (let yr = lastYear; yr <= 2030; yr++) {
		proj.push({ x: yr, y: last + stats.pace_2019_2025 * (yr - lastYear) });
	}
	for (let yr = 2015; yr <= 2030; yr++) {
		promised.push({ x: yr, y: stats.world_2015 + stats.pace_2015_2019 * (yr - 2015) });
	}
	const projEnd = proj.at(-1).y;
	const promisedEnd = promised.at(-1).y;

	const m = { top: 30, right: 200, bottom: 46, left: 58 };
	const iw = $derived(Math.max(120, w - m.left - m.right));
	const ih = $derived(Math.max(120, h - m.top - m.bottom));
	const x = $derived(scaleLinear().domain([2000, 2030]).range([0, iw]));
	const y = $derived(scaleLinear().domain([55, 78]).range([ih, 0]));

	const mkHist = $derived(
		d3line()
			.x((_, i) => x(years[i]))
			.y((v) => y(v))
	);
	const mk = $derived(
		d3line()
			.x((p) => x(p.x))
			.y((p) => y(p.y))
	);

	// The wedge between the two futures is the story: the cost of the slowdown.
	const gapArea = $derived(
		d3area()
			.x((p) => x(p.x))
			.y0((p) => y(p.y))
			.y1((p) => {
				const q = proj.find((r) => r.x === p.x);
				return y(q ? q.y : last);
			})(promised.filter((p) => p.x >= lastYear))
	);
</script>

<Section scene={9} id="projection" label="Four years">
	<div class="wrap">
		<div class="chart">
			<ChartFrame
				title="At today's pace the world reaches about {fmt1(stats.projection_2030)} by 2030"
				subtitle="World SDG Index score, 0 to 100. History to 2025, then the current pace projected to the deadline."
			>
				<div class="plot" bind:clientWidth={w} bind:clientHeight={h}>
					<svg width={w} height={h} role="img" aria-label="World SDG Index projected to 2030">
						<g transform="translate({m.left},{m.top})">
							{#each y.ticks(5) as t}
								<line x1="0" x2={iw} y1={y(t)} y2={y(t)} stroke={RULE} stroke-dasharray="2 4" />
								<text class="tick" x="-12" y={y(t)} dy="0.32em" text-anchor="end">{t}</text>
							{/each}
							{#each [2000, 2010, 2015, 2020, 2025, 2030] as t}
								<text class="tick" x={x(t)} y={ih + 28} text-anchor="middle">{t}</text>
							{/each}

							<!-- the gap between the promised path and the current one -->
							<path d={gapArea} fill={PACE.flat} opacity="0.1" />

							<!-- where the 2015 to 2019 pace was pointing -->
							<path
								d={mk(promised)}
								fill="none"
								stroke="#9AA4B2"
								stroke-width="2.5"
								stroke-dasharray="7 6"
							/>
							<text class="end-label" x={x(2030) + 10} y={y(promisedEnd)} dy="0.32em" fill="#7B8695">
								{fmt1(promisedEnd)} at the 2015–19 pace
							</text>

							<!-- history -->
							<path d={mkHist(score)} fill="none" stroke={UN_BLUE} stroke-width="4" />

							<!-- projection -->
							<path
								d={mk(proj)}
								fill="none"
								stroke={PACE.flat}
								stroke-width="4"
								stroke-dasharray="2 7"
								stroke-linecap="round"
							/>
							<circle cx={x(2030)} cy={y(projEnd)} r="6" fill={PACE.flat} />
							<text class="end-label strong" x={x(2030) + 10} y={y(projEnd)} dy="0.32em" fill={PACE.flat}>
								{fmt1(projEnd)} at today's pace
							</text>

							<line
								x1={x(2030)}
								y1={y(projEnd)}
								x2={x(2030)}
								y2={y(promisedEnd)}
								stroke={PACE.flat}
								stroke-width="1.5"
							/>

							<line x1={x(2030)} y1="0" x2={x(2030)} y2={ih} stroke="var(--color-ink)" stroke-width="1" />
							<text class="deadline" x={x(2030)} y="-10" text-anchor="middle">2030 deadline</text>
						</g>
					</svg>
				</div>
			</ChartFrame>
		</div>

		<div class="closing">
			<p>
				The difference between the current path and the promised one is not knowledge, money or
				technology. It is priorities, institutions and cooperation — the exact things you have spent
				this week practising in the Security Council.
			</p>
			<p class="small">
				In 2030 everyone in this room will be a voting adult. The last mile of these goals is your
				inheritance, not an abstraction.
			</p>
		</div>
	</div>
</Section>

<style>
	.wrap {
		max-width: 1500px;
		margin: 0 auto;
		padding: clamp(56px, 8vh, 104px) clamp(24px, 5vw, 64px);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 36px;
	}

	.chart {
		height: min(58vh, 620px);
	}

	.plot {
		width: 100%;
		height: 100%;
		min-height: 240px;
	}

	.closing {
		max-width: 78ch;
	}

	.closing p {
		font-size: var(--text-lede);
		line-height: 1.5;
		margin: 0;
	}

	.closing .small {
		font-size: var(--text-body);
		color: var(--color-ink-muted);
		margin-top: 14px;
	}

	.end-label {
		font-size: var(--text-tick);
		font-weight: 600;
		font-family: var(--font-body);
	}

	.end-label.strong {
		font-weight: 800;
	}

	.deadline {
		font-size: var(--text-micro);
		font-weight: 700;
		font-family: var(--font-body);
		fill: var(--color-ink);
	}
</style>
