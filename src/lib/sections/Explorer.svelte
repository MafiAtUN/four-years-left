<script>
	import { scaleLinear } from 'd3-scale';
	import { line as d3line } from 'd3-shape';
	import Section from '$lib/components/Section.svelte';
	import ChartFrame from '$lib/components/ChartFrame.svelte';
	import GoalTiles from '$lib/components/GoalTiles.svelte';
	import CountrySearch from '$lib/components/CountrySearch.svelte';
	import {
		countries,
		countryYears,
		regionSeries,
		REGION_SERIES_NAME,
		REGION_LABEL,
		fmt1
	} from '$lib/data';
	import { compare } from '$lib/stores/compare.svelte.js';
	import { RULE, UN_BLUE, DASH, textSafe, HOME } from '$lib/tokens';

	/**
	 * The countries that star in the story, preloaded as one click chips.
	 * Italy leads: it is the first one an Italian room reaches for.
	 */
	const CHIPS = [HOME, 'United States', 'Bangladesh', 'India', 'Lebanon', 'Finland'];

	let selected = $state('Bangladesh');
	let w = $state(800);
	let h = $state(400);

	const rec = $derived(countries[selected]);
	const regionKey = $derived(REGION_SERIES_NAME[rec.region] ?? 'World');
	const regionVals = $derived(regionSeries[regionKey] ?? regionSeries['World']);

	const m = { top: 24, right: 150, bottom: 44, left: 52 };
	const iw = $derived(Math.max(100, w - m.left - m.right));
	const ih = $derived(Math.max(80, h - m.top - m.bottom));

	const allSeries = $derived([
		rec.index,
		regionVals,
		...compare.entries.map((e) => e.rec.index)
	]);

	const yDomain = $derived.by(() => {
		const flat = allSeries.flat().filter((v) => v != null);
		const lo = Math.floor(Math.min(...flat) / 5) * 5;
		const hi = Math.ceil(Math.max(...flat) / 5) * 5;
		return [lo, hi];
	});

	const x = $derived(
		scaleLinear().domain([countryYears[0], countryYears.at(-1)]).range([0, iw])
	);
	const y = $derived(scaleLinear().domain(yDomain).range([ih, 0]));
	const mk = $derived(
		d3line()
			.defined((v) => v != null)
			.x((_, i) => x(countryYears[i]))
			.y((v) => y(v))
	);

	// The selected country plus the comparison set, as side by side columns.
	const columns = $derived([
		{ name: selected, rec, color: compare.colorOf(selected) ?? UN_BLUE, isSelected: true },
		...compare.entries
			.filter((e) => e.name !== selected)
			.map((e) => ({ name: e.name, rec: e.rec, color: e.color, isSelected: false }))
	]);
</script>

<Section scene={9} id="explorer" label="Country explorer">
	<div class="wrap">
		<header class="head">
			<div>
				<p class="eyebrow">The explorer</p>
				<h2>Look up any country.</h2>
				<p class="sub">
					Every ranked country, its score, its trajectory and all 17 goals. Start with the country
					your project is built for, then add up to three to the comparison set and they appear
					here side by side.
				</p>
			</div>
			<div class="search">
				<CountrySearch
					value={selected}
					onselect={(name) => (selected = name)}
					placeholder="Search 169 countries…"
				/>
				<div class="chips">
					{#each CHIPS as c}
						<button class="chip" class:on={selected === c} onclick={() => (selected = c)}>{c}</button>
					{/each}
				</div>
			</div>
		</header>

		<div class="body">
			<div class="numbers">
				<div class="big-stat">
					<p class="big tabular">{fmt1(rec.score)}</p>
					<p class="big-label">SDG Index score, out of 100</p>
				</div>
				<div class="big-stat">
					<p class="big tabular">{rec.rank}</p>
					<p class="big-label">Rank of 169</p>
				</div>
				<p class="region">{REGION_LABEL[regionKey] ?? rec.region} · spillover score {fmt1(rec.spill)}</p>
			</div>

			<div class="trend">
				<ChartFrame
					title="{selected}: {fmt1(rec.index[0])} in 2000 to {fmt1(rec.score)} today"
					subtitle="SDG Index score against the {REGION_LABEL[regionKey] ?? rec.region} average."
				>
					<div class="plot" bind:clientWidth={w} bind:clientHeight={h}>
						<svg width={w} height={h} role="img" aria-label="{selected} SDG Index trend">
							<g transform="translate({m.left},{m.top})">
								{#each y.ticks(4) as t}
									<line x1="0" x2={iw} y1={y(t)} y2={y(t)} stroke={RULE} stroke-dasharray="2 4" />
									<text class="tick" x="-10" y={y(t)} dy="0.32em" text-anchor="end">{t}</text>
								{/each}
								{#each [2000, 2010, 2020, 2025] as t}
									<text class="tick" x={x(t)} y={ih + 26} text-anchor="middle">{t}</text>
								{/each}

								<path d={mk(regionVals)} fill="none" stroke="#9AA4B2" stroke-width="2.5" stroke-dasharray="6 5" />
								<text class="direct" x={iw + 8} y={y(regionVals.at(-1))} dy="0.32em" fill="#7B8695">
									{REGION_LABEL[regionKey]}
								</text>

								{#each compare.entries.filter((e) => e.name !== selected) as e}
									<path d={mk(e.rec.index)} fill="none" stroke={e.color} stroke-width="2.5" />
									<text class="direct" x={iw + 8} y={y(e.rec.index.at(-1))} dy="0.32em" fill={e.color}>
										{e.name}
									</text>
								{/each}

								<path d={mk(rec.index)} fill="none" stroke={compare.colorOf(selected) ?? UN_BLUE} stroke-width="4" />
								<circle cx={x(2025)} cy={y(rec.score)} r="5" fill={compare.colorOf(selected) ?? UN_BLUE} />
								<text class="direct strong" x={iw + 8} y={y(rec.score)} dy="0.32em" fill={compare.colorOf(selected) ?? UN_BLUE}>
									{selected}
								</text>
							</g>
						</svg>
					</div>
				</ChartFrame>
			</div>
		</div>

		<div class="dashboards">
			{#each columns as col}
				<div class="col">
					<p class="col-name" style="color:{col.color}">
						{col.name}
						<span class="col-meta tabular">#{col.rec.rank} · {fmt1(col.rec.score)}</span>
					</p>
					<GoalTiles rec={col.rec} cols={6} size={58} />
				</div>
			{/each}
		</div>

		<p class="legend-note">
			Tile color is the goal rating, from <strong style="color:{textSafe(DASH.g)}">green</strong> through
			<strong style="color:{textSafe(DASH.y)}">yellow</strong> and
			<strong style="color:{textSafe(DASH.o)}">orange</strong> to
			<strong style="color:{textSafe(DASH.r)}">red</strong>; grey means no data. The arrow is the trend. Hover
			any tile for its goal.
		</p>
	</div>
</Section>

<style>
	.wrap {
		max-width: 1600px;
		margin: 0 auto;
		padding: clamp(56px, 8vh, 96px) clamp(24px, 4vw, 56px);
		min-height: 100vh;
	}

	.head {
		display: grid;
		grid-template-columns: 1fr minmax(320px, 460px);
		gap: 40px;
		align-items: start;
		border-bottom: 1px solid var(--color-rule);
		padding-bottom: 28px;
	}

	.eyebrow {
		font-size: var(--text-micro);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-link);
		margin: 0 0 10px;
	}

	h2 {
		font-size: clamp(34px, 3.4vw, 54px);
		margin: 0 0 12px;
	}

	.sub {
		font-size: var(--text-body);
		color: var(--color-ink-muted);
		max-width: 60ch;
		margin: 0;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 12px;
	}

	.chip {
		font-size: var(--text-micro);
		font-weight: 600;
		padding: 7px 14px;
		border-radius: 999px;
		border: 1px solid var(--color-rule);
		background: #fff;
		cursor: pointer;
	}

	.chip:hover,
	.chip.on {
		border-color: var(--color-un-blue);
		color: var(--color-link);
	}

	.body {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 40px;
		align-items: center;
		padding: 32px 0;
	}

	.big {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(56px, 5.5vw, 86px);
		line-height: 1;
		margin: 0;
		color: var(--color-navy);
	}

	.big-label {
		font-size: var(--text-small);
		color: var(--color-ink-muted);
		margin: 4px 0 22px;
	}

	.region {
		font-size: var(--text-small);
		color: var(--color-ink-muted);
		margin: 0;
		border-top: 1px solid var(--color-rule);
		padding-top: 14px;
	}

	.trend {
		height: 340px;
	}

	.plot {
		width: 100%;
		height: 100%;
		min-height: 200px;
	}

	.dashboards {
		display: flex;
		gap: 40px;
		flex-wrap: wrap;
		border-top: 1px solid var(--color-rule);
		padding-top: 28px;
	}

	.col-name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: var(--text-h3);
		margin: 0 0 12px;
	}

	.col-meta {
		font-family: var(--font-body);
		font-size: var(--text-small);
		font-weight: 600;
		color: var(--color-ink-muted);
		margin-left: 8px;
	}

	.legend-note {
		font-size: var(--text-small);
		color: var(--color-ink-muted);
		margin: 24px 0 0;
		max-width: 90ch;
	}

	.direct {
		font-size: var(--text-tick);
		font-family: var(--font-body);
		font-weight: 600;
	}

	.direct.strong {
		font-weight: 800;
	}

	@media (max-width: 1100px) {
		.head,
		.body {
			grid-template-columns: 1fr;
		}
	}
</style>
