<script>
	import { scaleLinear } from 'd3-scale';
	import { line as d3line } from 'd3-shape';
	import Section from '$lib/components/Section.svelte';
	import ChartFrame from '$lib/components/ChartFrame.svelte';
	import { povertyWorld, stats, fmt1 } from '$lib/data';
	import { motion } from '$lib/stores/motion.svelte.js';
	import { SDG, RULE } from '$lib/tokens';

	let guess = $state(/** @type {null | 'rising' | 'flat' | 'falling'} */ (null));
	let revealed = $state(false);
	let w = $state(900);
	let h = $state(460);

	const years = povertyWorld.years;
	const vals = povertyWorld.value;
	const first = vals[0];
	const last = vals.at(-1);
	const drop = ((first - last) / first) * 100;

	const m = { top: 26, right: 150, bottom: 46, left: 62 };
	const iw = $derived(Math.max(120, w - m.left - m.right));
	const ih = $derived(Math.max(120, h - m.top - m.bottom));
	const x = $derived(scaleLinear().domain([years[0], years.at(-1)]).range([0, iw]));
	const y = $derived(scaleLinear().domain([0, 35]).range([ih, 0]));
	const mk = $derived(
		d3line()
			.x((_, i) => x(years[i]))
			.y((v) => y(v))
	);

	/** The three guesses drawn as straight lines from the true 2000 value. */
	const guessLine = $derived.by(() => {
		if (!guess) return null;
		const end = guess === 'rising' ? first * 1.5 : guess === 'flat' ? first : first * 0.55;
		return `M${x(years[0])},${y(first)}L${x(years.at(-1))},${y(end)}`;
	});

	/** The guess never reveals anything: the room commits first, the truth lands on cue. */
	function vote(v) {
		guess = v;
	}

	/** The finding only becomes the title once the answer is out. */
	const chartTitle = $derived(
		revealed
			? `Extreme poverty fell from ${fmt1(first)}% to ${fmt1(last)}% in a single generation`
			: 'Since 2000, which way has extreme poverty moved?'
	);
</script>

<Section scene={2} id="poverty" label="The long good news">
	<div class="wrap">
		<div class="prose">
			<p class="eyebrow">Scene two</p>
			<h2>Before we judge the last decade, look at the last twenty five years.</h2>
			<p>
				In 2000, nearly a third of humanity lived in extreme poverty. Life expectancy was 67.6
				years, one child in eighteen died before turning five, and a fifth of the world had no
				electricity at all.
			</p>
			<p>
				Almost every one of those numbers has moved, and moved a long way. Most people, including
				most experts, guess the direction of that movement wrongly — which is the first thing worth
				knowing about the state of the world's promises.
			</p>

			<div class="vote" role="group" aria-label="Guess the direction of extreme poverty since 2000">
				<p class="ask">
					Since 2000, has the share of the world in extreme poverty been…
				</p>
				<div class="buttons">
					{#each [['rising', 'Rising'], ['flat', 'About flat'], ['falling', 'Falling']] as [key, label]}
						<button
							class="vote-btn"
							class:chosen={guess === key}
							onclick={() => vote(key)}
							aria-pressed={guess === key}
						>
							{label}
						</button>
					{/each}
				</div>
				{#if revealed}
					<p class="verdict" role="status">
						{#if guess === 'falling'}
							Correct — and probably by more than you think. It fell {fmt1(drop)}%, from
							{fmt1(first)}% to {fmt1(last)}%.
						{:else if guess}
							It has been falling, steeply: from {fmt1(first)}% to {fmt1(last)}%, a drop of
							{fmt1(drop)}%. Most rooms guess too pessimistically.
						{:else}
							It has been falling, steeply: from {fmt1(first)}% to {fmt1(last)}%, a drop of
							{fmt1(drop)}%.
						{/if}
					</p>
					<button class="again" onclick={() => { revealed = false; guess = null; }}>
						Guess again
					</button>
				{:else}
					<button class="reveal" onclick={() => (revealed = true)}>
						Reveal the actual numbers
					</button>
					<p class="hint">{guess ? 'Locked in.' : 'Pick one first — then reveal.'}</p>
				{/if}
			</div>
		</div>

		<div class="chart">
			<ChartFrame
				title={chartTitle}
				subtitle="Share of the world population living in extreme poverty, percent, {years[0]} to {years.at(-1)}."
				accent={SDG[1]}
			>
				<div class="plot" bind:clientWidth={w} bind:clientHeight={h}>
					<svg width={w} height={h} role="img" aria-label="World extreme poverty rate">
						<g transform="translate({m.left},{m.top})">
							{#each y.ticks(5) as t}
								<line x1="0" x2={iw} y1={y(t)} y2={y(t)} stroke={RULE} stroke-dasharray="2 4" />
								<text class="tick" x="-12" y={y(t)} dy="0.32em" text-anchor="end">{t}%</text>
							{/each}
							{#each [2000, 2008, 2016, 2026] as t}
								<text class="tick" x={x(t)} y={ih + 28} text-anchor="middle">{t}</text>
							{/each}

							<!-- the starting point is always visible, so the question is fair -->
							<circle cx={x(years[0])} cy={y(first)} r="6" fill={SDG[1]} />
							<text class="start" x={x(years[0]) + 12} y={y(first)} dy="-10">
								{fmt1(first)}% in {years[0]}
							</text>

							{#if guessLine}
								<path
									d={guessLine}
									fill="none"
									stroke="#8E99A8"
									stroke-width="2.5"
									stroke-dasharray="6 6"
								/>
								<text class="guess-label" x={iw + 8} y={y(guess === 'rising' ? first * 1.5 : guess === 'flat' ? first : first * 0.55)} dy="0.32em">
									your guess
								</text>
							{/if}

							{#if revealed}
								<path
									class="truth"
									class:instant={motion.reduced}
									d={mk(vals)}
									fill="none"
									stroke={SDG[1]}
									stroke-width="4.5"
								/>
								<circle cx={x(years.at(-1))} cy={y(last)} r="6" fill={SDG[1]} />
								<text class="end" x={x(years.at(-1)) + 10} y={y(last)} dy="0.32em" fill={SDG[1]}>
									{fmt1(last)}%
								</text>
							{/if}
						</g>
					</svg>
				</div>
			</ChartFrame>
		</div>
	</div>
</Section>

<style>
	.wrap {
		max-width: 1500px;
		margin: 0 auto;
		padding: clamp(56px, 8vh, 104px) clamp(24px, 5vw, 64px);
		min-height: 100vh;
		display: grid;
		grid-template-columns: minmax(380px, 42%) 1fr;
		gap: clamp(32px, 4vw, 64px);
		align-items: center;
	}

	.eyebrow {
		font-size: var(--text-micro);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-link);
		margin: 0 0 12px;
	}

	h2 {
		font-size: clamp(32px, 3.2vw, 50px);
		margin: 0 0 22px;
		max-width: 20ch;
	}

	.prose p {
		font-size: var(--text-body);
		line-height: 1.6;
		margin: 0 0 16px;
		max-width: 54ch;
	}

	.vote {
		margin-top: 30px;
		border-top: 1px solid var(--color-rule);
		padding-top: 22px;
	}

	.ask {
		font-weight: 700;
		font-size: var(--text-body);
		margin: 0 0 14px;
	}

	.buttons {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.vote-btn {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-body);
		padding: 12px 24px;
		border-radius: 999px;
		border: 2px solid var(--color-navy);
		background: #fff;
		color: var(--color-navy);
		cursor: pointer;
	}

	.vote-btn:hover {
		background: var(--color-navy);
		color: #fff;
	}

	.chosen {
		background: var(--color-navy);
		color: #fff;
	}

	/* The reveal is the beat of the scene, so it reads as a button, not a footnote. */
	.reveal {
		margin-top: 18px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-body);
		padding: 12px 26px;
		border-radius: 999px;
		border: 2px solid var(--color-navy);
		background: var(--color-navy);
		color: #fff;
		cursor: pointer;
	}

	.reveal:hover {
		background: #fff;
		color: var(--color-navy);
	}

	.hint {
		margin: 10px 0 0;
		font-size: var(--text-small);
		color: var(--color-ink-muted);
	}

	.again {
		margin-top: 12px;
		font-size: var(--text-small);
		background: none;
		border: 0;
		color: var(--color-link);
		text-decoration: underline;
		cursor: pointer;
		padding: 4px 0;
	}

	.verdict {
		margin: 16px 0 0;
		font-size: var(--text-body);
		font-weight: 600;
		max-width: 52ch;
	}

	.chart {
		height: min(62vh, 620px);
	}

	.plot {
		width: 100%;
		height: 100%;
		min-height: 240px;
	}

	/* The truth draws itself in, which is the payoff of the guess. */
	.truth {
		stroke-dasharray: 2400;
		stroke-dashoffset: 2400;
		animation: draw 1500ms ease-out forwards;
	}

	.truth.instant {
		animation-duration: 1ms;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	.start,
	.end,
	.guess-label {
		font-size: var(--text-tick);
		font-family: var(--font-body);
		font-weight: 700;
		fill: var(--color-ink);
	}

	.guess-label {
		fill: #6B7684;
		font-weight: 600;
	}

	@media (max-width: 1000px) {
		.wrap {
			grid-template-columns: 1fr;
		}
		.chart {
			height: 52vh;
		}
	}
</style>
