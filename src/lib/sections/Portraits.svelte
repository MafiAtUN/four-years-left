<script>
	import { scaleLinear } from 'd3-scale';
	import Section from '$lib/components/Section.svelte';
	import Scroller from '$lib/components/Scroller.svelte';
	import CaptionCard from '$lib/components/CaptionCard.svelte';
	import ChartFrame from '$lib/components/ChartFrame.svelte';
	import Hl from '$lib/components/Hl.svelte';
	import GoalTiles from '$lib/components/GoalTiles.svelte';
	import { ranks, countries, fmt1 } from '$lib/data';
	import { compare } from '$lib/stores/compare.svelte.js';
	import { DASH, RULE, SDG, HOME, HOME_COLOR } from '$lib/tokens';

	let index = $state(0);
	let w = $state(900);
	let h = $state(620);

	const CLIMBERS = ['India', 'Philippines', 'Benin', 'United Arab Emirates'];
	const FALLERS = ['Lebanon', 'Argentina', 'Zimbabwe'];

	// Which countries the current step lights up, and in what color. Italy is
	// lit on every step: the room needs its own line on screen the whole way
	// through, and its blue never means a rating.
	const focusOf = $derived.by(() => {
		const out = { [HOME]: HOME_COLOR };
		if (index === 0) return { ...out, 'United States': 'var(--color-sdg-10)' };
		if (index === 1) return { ...out, Bangladesh: 'var(--color-sdg-13)' };
		for (const c of CLIMBERS) out[c] = DASH.g;
		for (const c of FALLERS) out[c] = DASH.r;
		return out;
	});

	const m = { top: 30, right: 210, bottom: 34, left: 210 };
	const iw = $derived(Math.max(120, w - m.left - m.right));
	const ih = $derived(Math.max(120, h - m.top - m.bottom));

	const maxRank = Math.max(...ranks.map((r) => Math.max(r.r15, r.r25)));
	const y = $derived(scaleLinear().domain([1, maxRank]).range([0, ih]));
	const xL = 0;
	const xR = $derived(iw);

	/** Slot color wins over step color, so a country a student asked about
	    stays the same color for the rest of the hour. */
	function colorOf(name) {
		return compare.colorOf(name) ?? focusOf[name] ?? null;
	}

	const sideCountry = $derived(index === 0 ? 'United States' : index === 1 ? 'Bangladesh' : null);

	const titles = [
		'The richest large economy ranks 45th',
		'Bangladesh is green on climate. The United States is red.',
		'National trajectories are not fate'
	];

	const us = countries['United States'];
	const bd = countries['Bangladesh'];
	const usRank = ranks.find((r) => r.c === 'United States');
	const bdRank = ranks.find((r) => r.c === 'Bangladesh');
	const homeRank = ranks.find((r) => r.c === HOME);
	const usReds = us.dash.filter((d) => d === 'r').length;
	const usGreens = us.dash.filter((d) => d === 'g').length;

	const labelled = $derived(
		ranks
			.filter((r) => colorOf(r.c))
			.sort((a, b) => a.r25 - b.r25)
	);
</script>

<Section scene={7} id="portraits" label="Three portraits">
	<Scroller
		scene={7}
		count={3}
		bind:index
		labels={['United States', 'Bangladesh', 'Movers']}
	>
		{#snippet chart(i)}
			<div class="stage">
				<div class="chart-col">
					<ChartFrame
						title={titles[index]}
						subtitle="Change in SDG Index rank, 2015 to 2025, all {ranks.length} ranked countries. Rank 1 is at the top. {HOME} stays marked on every step."
						accent={index === 2 ? DASH.g : index === 1 ? SDG[13] : SDG[10]}
					>
						<div class="plot" bind:clientWidth={w} bind:clientHeight={h}>
							<svg width={w} height={h} role="img" aria-label={titles[index]}>
								<g transform="translate({m.left},{m.top})">
									<text class="col-head" x={xL} y="-12" text-anchor="middle">2015</text>
									<text class="col-head" x={xR} y="-12" text-anchor="middle">2025</text>

									{#each [1, 50, 100, 150] as r}
										<line x1={xL} x2={xR} y1={y(r)} y2={y(r)} stroke={RULE} stroke-dasharray="2 4" />
										<text class="tick" x={xL - 14} y={y(r)} dy="0.32em" text-anchor="end">{r}</text>
									{/each}

									<!-- every country, thin and grey: emphasis by fading everything else -->
									{#each ranks as r}
										{@const c = colorOf(r.c)}
										<line
											x1={xL}
											y1={y(r.r15)}
											x2={xR}
											y2={y(r.r25)}
											stroke={c ?? '#C3C9D2'}
											stroke-width={c ? 3.5 : 1}
											opacity={c ? 1 : Object.keys(focusOf).length ? 0.32 : 0.5}
											style="transition:opacity 400ms ease, stroke 400ms ease"
										/>
										{#if c}
											<circle cx={xR} cy={y(r.r25)} r="4.5" fill={c} />
										{/if}
									{/each}

									<!-- direct labels on the highlighted arrows only -->
									{#each labelled as r}
										{@const c = colorOf(r.c)}
										<text class="arrow-label" x={xR + 12} y={y(r.r25)} dy="0.32em" fill={c}>
											{r.c} {r.r15}→{r.r25}
										</text>
									{/each}
								</g>
							</svg>
						</div>
					</ChartFrame>
				</div>

				<!-- side card of goal tiles for the two country portraits -->
				{#if sideCountry}
					<div class="side">
						<p class="side-name">{sideCountry}</p>
						<p class="side-meta tabular">
							Rank {countries[sideCountry].rank} · Score {fmt1(countries[sideCountry].score)}
						</p>
						<GoalTiles rec={countries[sideCountry]} cols={6} size={54} />
						<p class="side-note">
							{#if index === 0}
								Red on {usReds} goals. Green on {usGreens}: innovation.
							{:else}
								Green on climate action, where the United States is red.
							{/if}
						</p>
					</div>
				{/if}
			</div>
		{/snippet}

		{#snippet step(i)}
			<CaptionCard
				accent={i === 2 ? DASH.g : i === 1 ? SDG[13] : SDG[10]}
				eyebrow={['Portrait one', 'Portrait two', 'Portrait three'][i]}
				active={i === index}
			>
				{#if i === 0}
					The <Hl c={SDG[10]}>United States fell from rank {usRank.r15} to {usRank.r25}</Hl>, red on
					{usReds} goals and green on one. Is that a data artifact or a policy verdict?
				{:else if i === 1}
					<Hl c={SDG[13]}>Bangladesh climbed from {bdRank.r15} to {bdRank.r25}</Hl> and is green on
					climate action while the United States is red. Low emitters bear the floods.
				{:else}
					<Hl c={DASH.g}>India, the Philippines, Benin and the UAE climbed</Hl> more than 17 places;
					<Hl c={DASH.r}>Lebanon fell 25</Hl>. <Hl c={HOME_COLOR}
						>{#if homeRank.r15 === homeRank.r25}{HOME} held {homeRank.r25}th{:else}{HOME} went
							{homeRank.r15} to {homeRank.r25}{/if}</Hl
					>: policy moves countries up, crisis moves them down fast, and staying put is its own
					result.
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
		gap: 28px;
		padding: clamp(20px, 4vh, 48px) clamp(24px, 3vw, 40px);
		padding-left: clamp(24px, 32vw, 500px);
	}

	.chart-col {
		flex: 1 1 auto;
		height: 100%;
		min-width: 0;
	}

	.plot {
		width: 100%;
		height: 100%;
		min-height: 260px;
	}

	.side {
		flex: 0 0 auto;
		width: 380px;
		background: #fff;
		border: 1px solid var(--color-rule);
		border-radius: 6px;
		padding: 18px 20px;
		box-shadow: 0 8px 28px rgb(11 27 63 / 0.1);
	}

	.side-name {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 30px;
		margin: 0;
		line-height: 1.1;
	}

	.side-meta {
		font-size: var(--text-small);
		color: var(--color-ink-muted);
		margin: 2px 0 14px;
	}

	.side-note {
		font-size: var(--text-small);
		margin: 14px 0 0;
		color: var(--color-ink);
	}

	.col-head {
		font-size: var(--text-tick);
		font-weight: 700;
		font-family: var(--font-body);
		fill: var(--color-ink-muted);
	}

	.arrow-label {
		font-size: var(--text-tick);
		font-weight: 700;
		font-family: var(--font-body);
		paint-order: stroke;
		stroke: #fff;
		stroke-width: 3px;
	}

	@media (max-width: 1200px) {
		.side {
			display: none;
		}
	}

	@media (max-width: 900px) {
		.stage {
			padding-left: clamp(16px, 4vw, 24px);
			align-items: flex-start;
			padding-top: 7vh;
		}
	}
</style>
