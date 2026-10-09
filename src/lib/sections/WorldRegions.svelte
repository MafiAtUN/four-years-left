<script>
	import { geoEqualEarth, geoPath } from 'd3-geo';
	import { scaleLinear } from 'd3-scale';
	import { line as d3line } from 'd3-shape';
	import { feature } from 'topojson-client';
	import Section from '$lib/components/Section.svelte';
	import Scroller from '$lib/components/Scroller.svelte';
	import CaptionCard from '$lib/components/CaptionCard.svelte';
	import ChartFrame from '$lib/components/ChartFrame.svelte';
	import Hl from '$lib/components/Hl.svelte';
	import topo from '$static/countries-110m.json';
	import nameMap from '$static/name_map.json';
	import {
		countries,
		regionSeries,
		regionYears,
		countryYears,
		REGION_LINES,
		REGION_LABEL,
		fmt1
	} from '$lib/data';
	import { compare } from '$lib/stores/compare.svelte.js';
	import {
		BLUE_RAMP,
		SCORE_BINS,
		scoreBin,
		REGION_COLOR,
		MICROSTATES,
		RULE,
		DASH,
		HOME,
		HOME_DOT
	} from '$lib/tokens';

	let index = $state(0);
	let w = $state(1000);
	let h = $state(620);

	const showMap = $derived(index === 0);

	/* ---------------- map ---------------- */
	const land = feature(topo, topo.objects.countries).features;

	/** SDR name -> TopoJSON name, then TopoJSON name -> score. */
	const scoreByTopoName = (() => {
		const out = {};
		for (const [sdrName, rec] of Object.entries(countries)) {
			out[nameMap[sdrName] ?? sdrName] = { score: rec.score, name: sdrName };
		}
		return out;
	})();

	const projection = $derived(
		geoEqualEarth().fitSize([Math.max(80, w), Math.max(60, h - 74)], { type: 'Sphere' })
	);
	const path = $derived(geoPath(projection));

	function fillOf(f) {
		const hit = scoreByTopoName[f.properties.name];
		if (!hit) return '#E8EBF0'; // ranked countries only; the rest stay grey
		return BLUE_RAMP[scoreBin(hit.score)];
	}

	/** Finland and South Sudan mark the two extremes; Italy is the room itself. */
	const callouts = [HOME, 'Finland', 'South Sudan'];

	/* ---------------- regional lines ---------------- */
	const m = { top: 22, right: 262, bottom: 46, left: 54 };
	const iw = $derived(Math.max(100, w - m.left - m.right));
	const ih = $derived(Math.max(100, h - m.top - m.bottom));
	const x = $derived(
		scaleLinear().domain([regionYears[0], regionYears.at(-1)]).range([0, iw])
	);
	const y = $derived(scaleLinear().domain([40, 82]).range([ih, 0]));
	const mk = $derived(
		d3line()
			.defined((v) => v != null)
			.x((_, i) => x(regionYears[i]))
			.y((v) => y(v))
	);

	const HIGHLIGHT = [[], [], [], ['Sub-Saharan Africa', 'East and South Asia']];
	const highlighted = $derived(HIGHLIGHT[index] ?? []);
	const isDim = (key) => highlighted.length > 0 && !highlighted.includes(key);

	const oecdNow = regionSeries['OECD members'].at(-1);
	const ssaNow = regionSeries['Sub-Saharan Africa'].at(-1);
	const ssaThen = regionSeries['Sub-Saharan Africa'][0];
	const esaThen = regionSeries['East and South Asia'][0];
	const esaNow = regionSeries['East and South Asia'].at(-1);
	const gap = oecdNow - ssaNow;

	/** Labels stacked at the right edge so none collide. */
	const endLabels = $derived.by(() => {
		const items = [...REGION_LINES, 'World'].map((k) => ({
			key: k,
			label: REGION_LABEL[k],
			v: regionSeries[k].at(-1),
			color: REGION_COLOR[k]
		}));
		items.sort((a, b) => b.v - a.v);
		let prev = -Infinity;
		for (const it of items) {
			let py = y(it.v);
			if (py - prev < 22) py = prev + 22;
			it.py = py;
			prev = py;
		}
		return items;
	});

	const overlays = $derived(
		compare.entries.map((e) => ({
			...e,
			pts: countryYears.map((yr, i) => ({ x: yr, y: e.rec.index[i] })).filter((p) => p.y != null)
		}))
	);

	const titles = [
		'Where you are born still writes most of your scorecard',
		'Every region has climbed since 2000',
		`A ${fmt1(gap)} point gap separates the richest and poorest regions`,
		'But the poorest regions are closing the distance'
	];
</script>

<Section scene={6} id="world" label="The world and its regions">
	<Scroller
		scene={6}
		count={4}
		bind:index
		labels={['World map', 'Regional lines', 'The gap', 'Convergence']}
	>
		{#snippet chart(i)}
			<div class="stage">
				<div class="chart-col">
					<ChartFrame
						title={titles[index]}
						subtitle={showMap
							? 'SDG Index score, 0 to 100, 169 ranked countries. Grey means not ranked.'
							: 'SDG Index score, 0 to 100, regional averages, 2000 to 2025.'}
					>
						<div class="plot" bind:clientWidth={w} bind:clientHeight={h}>
							<!-- Map and lines crossfade: the Atlas map into chart move,
							     and a safe transition when motion is reduced. -->
							<div class="layer" style="opacity:{showMap ? 1 : 0}" aria-hidden={!showMap}>
								<svg width={w} height={h} role="img" aria-label="World map of SDG Index scores">
									<g>
										{#each land as f}
											<path d={path(f)} fill={fillOf(f)} stroke="#fff" stroke-width="0.5" />
										{/each}

										<!-- the nine ranked microstates with no polygon at this scale -->
										{#each Object.entries(MICROSTATES) as [name, lonlat]}
											{@const p = projection(lonlat)}
											{#if p && countries[name]}
												<circle
													cx={p[0]}
													cy={p[1]}
													r="3.2"
													fill={BLUE_RAMP[scoreBin(countries[name].score)]}
													stroke="#fff"
													stroke-width="0.7"
												/>
											{/if}
										{/each}

										<!-- Finland and South Sudan are ink pins at the two extremes.
										     Italy is red, so the room finds itself on the map first. -->
										{#each callouts as c}
											{@const rec = countries[c]}
											{@const f = land.find((l) => l.properties.name === (nameMap[c] ?? c))}
											{#if f}
												{@const cen = path.centroid(f)}
												{@const isHome = c === HOME}
												<circle
													cx={cen[0]}
													cy={cen[1]}
													r={isHome ? 6 : 4}
													fill={isHome ? HOME_DOT : 'var(--color-ink)'}
													stroke="#fff"
													stroke-width={isHome ? 1.6 : 0}
												/>
												<!-- .map-label fills in CSS, which beats the attribute, so the
												     red override has to be an inline style -->
												<text
													class="map-label"
													x={cen[0] + (isHome ? 11 : 8)}
													y={cen[1] - 6}
													style={isHome ? `fill:${HOME_DOT}` : null}
												>
													{c} {fmt1(rec.score)}
												</text>
											{/if}
										{/each}
									</g>

									<!-- legend bar: a ramp needs its scale, unlike a series legend -->
									<g transform="translate(0,{h - 46})">
										{#each BLUE_RAMP as c, k}
											<rect x={k * 54} y="0" width="54" height="12" fill={c} />
											{#if k < SCORE_BINS.length}
												<text class="legend-tick" x={(k + 1) * 54} y="30" text-anchor="middle">
													{SCORE_BINS[k]}
												</text>
											{/if}
										{/each}
										<text class="legend-tick" x={BLUE_RAMP.length * 54 + 12} y="11">
											SDG Index score
										</text>
									</g>
								</svg>
							</div>

							<div class="layer" style="opacity:{showMap ? 0 : 1}" aria-hidden={showMap}>
								<svg width={w} height={h} role="img" aria-label="Regional SDG Index lines">
									<g transform="translate({m.left},{m.top})">
										{#each y.ticks(5) as t}
											<line x1="0" x2={iw} y1={y(t)} y2={y(t)} stroke={RULE} stroke-dasharray="2 4" />
											<text class="tick" x="-12" y={y(t)} dy="0.32em" text-anchor="end">{t}</text>
										{/each}
										{#each [2000, 2005, 2010, 2015, 2020, 2025] as t}
											<text class="tick" x={x(t)} y={ih + 28} text-anchor="middle">{t}</text>
										{/each}

										{#each [...REGION_LINES, 'World'] as key}
											<path
												d={mk(regionSeries[key])}
												fill="none"
												stroke={REGION_COLOR[key]}
												stroke-width={key === 'World' ? 2.5 : highlighted.includes(key) ? 5 : 3}
												stroke-dasharray={key === 'World' ? '6 5' : null}
												opacity={isDim(key) ? 0.16 : 1}
												style="transition:opacity 500ms ease, stroke-width 400ms ease"
											/>
										{/each}

										{#each endLabels as l}
											<text
												class="direct"
												x={iw + 10}
												y={l.py}
												dy="0.32em"
												fill={l.color}
												opacity={isDim(l.key) ? 0.2 : 1}
												style="transition:opacity 500ms ease"
											>
												{l.label} {fmt1(l.v)}
											</text>
										{/each}

										{#each overlays as o}
											<path d={mk(o.pts.map((p) => p.y))} fill="none" stroke={o.color} stroke-width="2.5" />
											<circle cx={x(o.pts.at(-1).x)} cy={y(o.pts.at(-1).y)} r="4" fill={o.color} />
										{/each}

										<!-- gap annotation -->
										{#if index === 2}
											<g>
												<line
													x1={x(2025) - 6}
													y1={y(oecdNow)}
													x2={x(2025) - 6}
													y2={y(ssaNow)}
													stroke="var(--color-ink)"
													stroke-width="2"
												/>
												<rect
													x={x(2025) - 132}
													y={(y(oecdNow) + y(ssaNow)) / 2 - 22}
													width="120"
													height="44"
													rx="4"
													fill="#fff"
													opacity="0.94"
												/>
												<text
													class="gap"
													x={x(2025) - 72}
													y={(y(oecdNow) + y(ssaNow)) / 2}
													text-anchor="middle"
													dy="0.32em">{fmt1(gap)} points</text
												>
											</g>
										{/if}
									</g>
								</svg>
							</div>
						</div>
					</ChartFrame>
				</div>
			</div>
		{/snippet}

		{#snippet step(i)}
			<CaptionCard
				accent={i === 3 ? REGION_COLOR['Sub-Saharan Africa'] : 'var(--color-un-blue)'}
				eyebrow={['The world in 2026', 'Regions since 2000', 'The gap', 'Convergence'][i]}
				active={i === index}
			>
				{#if i === 0}
					<!-- The pale end of the ramp is unreadable as text, so only the dark
					     end is used as a caption highlight; the legend bar carries the rest. -->
					Darker means a higher score. <Hl c={BLUE_RAMP[4]}>Finland leads at {fmt1(countries['Finland'].score)}</Hl>;
					{HOME} is {countries[HOME].rank}th at {fmt1(countries[HOME].score)}; at the palest end,
					South Sudan is last at {fmt1(countries['South Sudan'].score)}.
				{:else if i === 1}
					Every region scores higher today than in 2000. Not one has gone backwards over the quarter
					century.
				{:else if i === 2}
					<Hl c={REGION_COLOR['OECD members']}>The OECD averages {fmt1(oecdNow)}</Hl>;
					<Hl c={REGION_COLOR['Sub-Saharan Africa']}>Sub-Saharan Africa {fmt1(ssaNow)}</Hl>. Where
					you are born is still worth {fmt1(gap)} points.
				{:else}
					<Hl c={REGION_COLOR['Sub-Saharan Africa']}>Sub-Saharan Africa gained {fmt1(ssaNow - ssaThen)} points</Hl>
					since 2000 and <Hl c={REGION_COLOR['East and South Asia']}>East and South Asia {fmt1(esaNow - esaThen)}</Hl>.
					Poorer regions are moving toward the frontier, not away from it.
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
		padding-left: clamp(24px, 34vw, 520px);
	}

	.chart-col {
		width: 100%;
		height: 100%;
		max-width: 1250px;
	}

	.plot {
		width: 100%;
		height: 100%;
		min-height: 280px;
		position: relative;
	}

	.layer {
		position: absolute;
		inset: 0;
		transition: opacity 600ms ease;
	}

	.map-label {
		font-size: var(--text-tick);
		font-weight: 700;
		font-family: var(--font-body);
		fill: var(--color-ink);
		paint-order: stroke;
		stroke: #fff;
		stroke-width: 3px;
	}

	.legend-tick {
		font-size: var(--text-micro);
		fill: var(--color-ink-muted);
		font-family: var(--font-body);
	}

	.direct {
		font-size: var(--text-tick);
		font-weight: 700;
		font-family: var(--font-body);
	}

	.gap {
		font-size: 21px;
		font-weight: 800;
		font-family: var(--font-display);
		fill: var(--color-ink);
	}

	@media (max-width: 900px) {
		.stage {
			padding-left: clamp(16px, 4vw, 24px);
			align-items: flex-start;
			padding-top: 7vh;
		}
	}
</style>
