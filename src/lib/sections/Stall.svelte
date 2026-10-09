<script>
	import { scaleLinear } from 'd3-scale';
	import Section from '$lib/components/Section.svelte';
	import Scroller from '$lib/components/Scroller.svelte';
	import CaptionCard from '$lib/components/CaptionCard.svelte';
	import ChartFrame from '$lib/components/ChartFrame.svelte';
	import Hl from '$lib/components/Hl.svelte';
	import { worldIndex, stats, countryYears, countries, fmt2 } from '$lib/data';
	import { compare } from '$lib/stores/compare.svelte.js';
	import { PACE, INK_MUTED, RULE, HOME, HOME_COLOR } from '$lib/tokens';

	let index = $state(0);
	let w = $state(900);
	let h = $state(560);

	const years = worldIndex.years;
	const score = worldIndex.score;

	/**
	 * Value band coloring: each one year segment is colored by how fast the
	 * world moved that year. The line itself carries the finding.
	 */
	const FAST = 0.4;
	const SLOW = 0.2;
	function paceColor(d) {
		return d >= FAST ? PACE.fast : d >= SLOW ? PACE.slow : PACE.flat;
	}

	const segments = years.slice(1).map((y, i) => {
		const d = score[i + 1] - score[i];
		return { x0: years[i], y0: score[i], x1: y, y1: score[i + 1], d, color: paceColor(d) };
	});

	// Each step focuses a span of years; everything outside it fades.
	const STEPS = [
		{ from: 2000, to: 2025, key: 'all' },
		{ from: 2015, to: 2019, key: 'fast' },
		{ from: 2019, to: 2025, key: 'slow' },
		{ from: 2024, to: 2025, key: 'flat' }
	];
	const focus = $derived(STEPS[index] ?? STEPS[0]);

	const overlays = $derived(
		compare.entries.map((e) => ({
			...e,
			points: countryYears.map((y, i) => ({ x: y, y: e.rec.index[i] })).filter((p) => p.y != null)
		}))
	);

	/**
	 * Italy rides along with the world line so the room can see its own
	 * trajectory against the global one. It steps aside when a student adds
	 * Italy to the comparison set, so it is never drawn twice.
	 */
	const homePoints = countryYears
		.map((y, i) => ({ x: y, y: countries[HOME].index[i] }))
		.filter((p) => p.y != null);
	const showHome = $derived(!compare.has(HOME));

	// Right margin holds the direct end labels, including the longest
	// comparison country name.
	const margin = { top: 28, right: 170, bottom: 46, left: 56 };
	const iw = $derived(Math.max(120, w - margin.left - margin.right));
	const ih = $derived(Math.max(120, h - margin.top - margin.bottom));

	// The specified domain is 55 to 75; it only ever widens, never narrows,
	// so an overlaid country can never fall off the chart. Italy sits above 80,
	// so the domain opens to 85 for it.
	const yDomain = $derived.by(() => {
		let lo = 55,
			hi = 75;
		for (const p of homePoints) {
			lo = Math.min(lo, p.y);
			hi = Math.max(hi, p.y);
		}
		for (const o of overlays) {
			for (const p of o.points) {
				lo = Math.min(lo, p.y);
				hi = Math.max(hi, p.y);
			}
		}
		return [Math.floor(lo / 5) * 5, Math.ceil(hi / 5) * 5];
	});

	const x = $derived(scaleLinear().domain([2000, 2025]).range([0, iw]));
	const y = $derived(scaleLinear().domain(yDomain).range([ih, 0]));

	const yTicks = $derived(y.ticks(5));
	const xTicks = [2000, 2005, 2010, 2015, 2020, 2025];

	function dimmed(seg) {
		return seg.x1 <= focus.from || seg.x0 >= focus.to;
	}

	function linePath(points) {
		return points.map((p, i) => `${i ? 'L' : 'M'}${x(p.x)},${y(p.y)}`).join('');
	}

	const captions = [
		{ accent: PACE.fast, eyebrow: 'The world SDG Index, 2000 to 2025' },
		{ accent: PACE.fast, eyebrow: '2015 to 2019' },
		{ accent: PACE.slow, eyebrow: '2019 to 2025' },
		{ accent: PACE.flat, eyebrow: '2024 to 2025' }
	];
</script>

<Section scene={3} id="stall" label="The stall">
	<Scroller
		scene={3}
		count={4}
		bind:index
		labels={['Full line', 'Fast years', 'Slowing', 'The plateau']}
	>
		{#snippet chart(i)}
			<div class="stage">
				<div class="chart-col">
					<ChartFrame
						title="Progress has not stopped. It has almost stalled."
						subtitle="World SDG Index score, 0 to 100, 2000 to 2025. Line color shows how much the world gained each year. {HOME} is drawn alongside for scale."
					>
						<div class="plot" bind:clientWidth={w} bind:clientHeight={h}>
							<svg width={w} height={h} role="img" aria-label="World SDG Index, 2000 to 2025">
								<g transform="translate({margin.left},{margin.top})">
									<!-- dotted gridlines, minimal ticks -->
									{#each yTicks as t}
										<line
											x1="0"
											x2={iw}
											y1={y(t)}
											y2={y(t)}
											stroke={RULE}
											stroke-dasharray="2 4"
										/>
										<text class="tick" x="-12" y={y(t)} dy="0.32em" text-anchor="end">{t}</text>
									{/each}

									{#each xTicks as t}
										<text class="tick" x={x(t)} y={ih + 28} text-anchor="middle">{t}</text>
									{/each}

									<!-- focus band -->
									{#if focus.key !== 'all'}
										<rect
											x={x(focus.from)}
											y="0"
											width={Math.max(2, x(focus.to) - x(focus.from))}
											height={ih}
											fill="var(--color-un-blue)"
											opacity="0.06"
										/>
									{/if}

									<!-- the world line, one path per year, colored by pace -->
									{#each segments as s}
										<line
											x1={x(s.x0)}
											y1={y(s.y0)}
											x2={x(s.x1)}
											y2={y(s.y1)}
											stroke={s.color}
											stroke-width="4"
											stroke-linecap="round"
											opacity={dimmed(s) ? 0.18 : 1}
											style="transition:opacity 500ms ease"
										/>
									{/each}

									<!-- the room's own country, always on, direct labeled -->
									{#if showHome}
										<path
											d={linePath(homePoints)}
											fill="none"
											stroke={HOME_COLOR}
											stroke-width="2.5"
											opacity="0.95"
										/>
										<circle
											cx={x(homePoints.at(-1).x)}
											cy={y(homePoints.at(-1).y)}
											r="4"
											fill={HOME_COLOR}
										/>
										<text
											class="overlay-label"
											x={x(homePoints.at(-1).x) + 8}
											y={y(homePoints.at(-1).y)}
											dy="0.32em"
											fill={HOME_COLOR}>{HOME}</text
										>
									{/if}

									<!-- comparison overlays, thin, direct labeled at the end -->
									{#each overlays as o}
										<path
											d={linePath(o.points)}
											fill="none"
											stroke={o.color}
											stroke-width="2"
											opacity="0.95"
										/>
										<circle
											cx={x(o.points.at(-1).x)}
											cy={y(o.points.at(-1).y)}
											r="4"
											fill={o.color}
										/>
										<text
											class="overlay-label"
											x={x(o.points.at(-1).x) + 8}
											y={y(o.points.at(-1).y)}
											dy="0.32em"
											fill={o.color}>{o.name}</text
										>
									{/each}

									<!-- world end marker -->
									<circle cx={x(2025)} cy={y(score.at(-1))} r="5" fill={PACE.flat} />
									{#if !overlays.some((o) => Math.abs(o.points.at(-1).y - score.at(-1)) < 1.6)}
										<text
											class="overlay-label"
											x={x(2025) + 10}
											y={y(score.at(-1))}
											dy="0.32em"
											fill="var(--color-ink)">World</text
										>
									{/if}

									<!-- step annotations -->
									{#if focus.key === 'fast'}
										<text class="annot" x={x(2017)} y={y(66.2) - 22} text-anchor="middle">
											+{stats.pace_2015_2019.toFixed(2)} points per year
										</text>
									{/if}
									{#if focus.key === 'slow'}
										<text class="annot" x={x(2022)} y={y(67.2) + 46} text-anchor="middle">
											+{stats.pace_2019_2025.toFixed(2)} points per year
										</text>
									{/if}
									{#if focus.key === 'flat'}
										<line
											x1={x(2024)}
											y1={y(score.at(-1)) - 34}
											x2={x(2024)}
											y2={y(score.at(-1)) - 8}
											stroke={PACE.flat}
											stroke-width="2"
										/>
									{/if}
								</g>
							</svg>

							{#if focus.key === 'flat'}
								<!-- Atlas style corner callout -->
								<div class="callout">
									<p class="big tabular display">{fmt2(stats.gain_last_year)}</p>
									<p class="big-label">points gained<br />in the latest year</p>
								</div>
							{/if}
						</div>
					</ChartFrame>
				</div>
			</div>
		{/snippet}

		{#snippet step(i)}
			<CaptionCard accent={captions[i].accent} eyebrow={captions[i].eyebrow} active={i === index}>
				{#if i === 0}
					The world has gained about ten points since 2000, but the line is not one story: it runs
					<Hl c={PACE.fast}>fast</Hl>, then <Hl c={PACE.slow}>slower</Hl>, then
					<Hl c={PACE.flat}>almost flat</Hl>.
				{:else if i === 1}
					In the four years after the goals were adopted, the world gained
					<Hl c={PACE.fast}>{stats.pace_2015_2019.toFixed(2)} points a year</Hl>. At that pace 2030
					looked reachable.
				{:else if i === 2}
					Since 2019 the pace has been <Hl c={PACE.slow}
						>{stats.pace_2019_2025.toFixed(2)} points a year</Hl
					>, roughly half. Pandemic, war, debt distress and trade fragmentation all land in this
					stretch.
				{:else}
					Between 2024 and 2025 the world moved <Hl c={PACE.flat}
						>{fmt2(stats.gain_last_year)} points</Hl
					>, the slowest year on record. This is the moment the curve stopped bending upward.
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
		max-width: 1100px;
	}

	.plot {
		width: 100%;
		height: 100%;
		min-height: 260px;
		position: relative;
	}

	:global(.tick) {
		font-size: var(--text-tick);
		fill: var(--color-ink-muted);
		font-family: var(--font-body);
	}

	.overlay-label {
		font-size: var(--text-tick);
		font-weight: 600;
		font-family: var(--font-body);
	}

	.annot {
		font-size: 19px;
		font-weight: 700;
		font-family: var(--font-body);
		fill: var(--color-ink);
	}

	.callout {
		position: absolute;
		top: 4px;
		right: 8px;
		text-align: right;
		background: rgb(255 255 255 / 0.92);
		padding: 8px 12px;
		border-radius: 6px;
	}

	.big {
		font-size: clamp(64px, 8vw, 112px);
		line-height: 0.9;
		color: var(--color-dash-red);
		margin: 0;
		font-weight: 800;
	}

	.big-label {
		font-size: var(--text-small);
		color: var(--color-ink-muted);
		margin: 6px 0 0;
		line-height: 1.25;
	}

	@media (max-width: 900px) {
		.stage {
			padding-left: clamp(16px, 4vw, 24px);
			align-items: flex-start;
			padding-top: 8vh;
		}
		.plot {
			min-height: 200px;
		}
	}
</style>
