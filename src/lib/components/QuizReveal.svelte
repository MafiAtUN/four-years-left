<script>
	import { onMount } from 'svelte';
	import ChartFrame from '$lib/components/ChartFrame.svelte';
	import { CHIMP } from '$lib/quiz-config.js';
	import { DASH } from '$lib/tokens';

	/**
	 * One question revealed on the big screen: the room's answer distribution as
	 * horizontal bars, the correct option in green, the chimpanzee benchmark as a
	 * dashed line at 33 percent, then the fact and the source.
	 *
	 * With no room data the same chart still stands up: the options keep their
	 * rows, the correct one is still green and still labelled, the chimp line is
	 * still there. Only the bars are missing, and nothing says so.
	 *
	 * @type {{
	 *   question: any,
	 *   n: number,
	 *   total: number,
	 *   row: { counts: number[], total: number, shares: number[] } | null,
	 *   live: boolean
	 * }}
	 */
	let { question, n, total, row, live } = $props();

	const GREEN = '#2EA043';
	const GREY = DASH.x;

	// Bars are only drawn once somebody in the room has actually answered.
	const hasBars = $derived(live && !!row && row.total > 0);

	// Bars grow from the axis on the advance keypress. The component is keyed on
	// the question, so every reveal starts at zero rather than morphing out of
	// the previous question's shares.
	let shown = $state(false);
	onMount(() => {
		const raf = requestAnimationFrame(() => requestAnimationFrame(() => (shown = true)));
		return () => cancelAnimationFrame(raf);
	});

	const pct = (v) => `${Math.round(v * 100)}%`;
	const TICKS = [0, 25, 50, 75, 100];
</script>

<ChartFrame
	dark
	accent={GREEN}
	title={question.text}
	subtitle={hasBars
		? `Share of the room choosing each answer. ${row.total} ${row.total === 1 ? 'answer' : 'answers'} so far.`
		: 'The answer, and where random guessing lands.'}
	source={question.source}
>
	<div class="wrap">
		<p class="eyebrow">Question {n} of {total}</p>

		<div class="plot">
			<div class="measure">
				<div class="rows">
					{#each question.options as opt, i}
						{@const correct = i === question.correct}
						<div class="row">
							<div class="label" class:correct>
								{#if correct}<span class="tick-mark" aria-hidden="true">✓</span>{/if}{opt}
							</div>
							<div class="track" class:empty={!hasBars}>
								<div
									class="bar"
									style="width:{shown && hasBars ? (row.shares[i] * 100).toFixed(1) : 0}%;
									       background:{correct ? GREEN : GREY}"
								></div>
							</div>
							<div class="value tabular" class:correct>
								{#if hasBars}
									{pct(row.shares[i])}
								{:else if correct}
									correct
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<!-- The chimp line sits over the track column only, so 33 percent means
				     33 percent of the axis and not 33 percent of the whole figure. -->
				<div class="overlay" aria-hidden="true">
					<div class="chimp" style="left:{CHIMP * 100}%">
						<span class="chimp-label">a chimpanzee scores here</span>
					</div>
				</div>

				<div class="axis" aria-hidden="true">
					<div class="axis-track">
						{#each TICKS as t}
							<span class="tick" style="left:{t}%">{t}%</span>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<p class="fact">
			<span class="fact-key">The answer</span>
			{question.fact}
		</p>

		{#if !hasBars}
			<p class="hands">Hands up: who picked that one?</p>
		{/if}
	</div>
</ChartFrame>

<style>
	.wrap {
		--lab: clamp(200px, 24vw, 420px);
		--val: 110px;
		--gap: 20px;
		--axis-h: 46px;
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: clamp(12px, 2vh, 26px);
		padding-top: 4px;
	}

	.eyebrow {
		font-size: var(--text-tick);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.6);
		margin: 0;
	}

	.plot {
		flex: 1 1 auto;
		min-height: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* The plot area proper: bars, the chimp line and the axis share one box, so
	   the dashed line spans the bars and stops on the axis instead of floating
	   through the whole slide. */
	.measure {
		position: relative;
		padding-top: 34px; /* room for the chimp label */
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: clamp(12px, 2.2vh, 26px);
	}

	.row {
		display: grid;
		grid-template-columns: var(--lab) 1fr var(--val);
		align-items: center;
		gap: var(--gap);
	}

	.label {
		font-size: clamp(19px, 1.35vw, 26px);
		line-height: 1.2;
		color: rgb(255 255 255 / 0.82);
		text-align: right;
	}

	.label.correct {
		color: #fff;
		font-weight: 700;
	}

	.tick-mark {
		color: #2ea043;
		font-weight: 700;
		margin-right: 8px;
	}

	.track {
		position: relative;
		height: clamp(34px, 5.4vh, 56px);
		background: rgb(255 255 255 / 0.07);
		border-radius: 3px;
	}

	/* With no room data the track becomes an empty dashed frame rather than a
	   filled slot, so the chart reads as "not measured here", never as
	   "everybody chose this". */
	.track.empty {
		background: none;
		border: 1px dashed rgb(255 255 255 / 0.16);
	}

	.bar {
		height: 100%;
		border-radius: 3px;
		transition: width 900ms cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.value {
		font-size: clamp(19px, 1.35vw, 26px);
		font-weight: 700;
		color: rgb(255 255 255 / 0.8);
	}

	.value.correct {
		color: #2ea043;
	}

	.overlay {
		position: absolute;
		top: 34px;
		bottom: calc(var(--axis-h) - 1px);
		left: calc(var(--lab) + var(--gap));
		right: calc(var(--val) + var(--gap));
		pointer-events: none;
	}

	.chimp {
		position: absolute;
		top: -34px;
		bottom: 0;
		border-left: 2px dashed rgb(255 255 255 / 0.55);
	}

	.chimp-label {
		position: absolute;
		top: 0;
		left: 10px;
		white-space: nowrap;
		font-size: var(--text-tick);
		color: rgb(255 255 255 / 0.66);
	}

	.axis {
		height: var(--axis-h);
		display: grid;
		grid-template-columns: var(--lab) 1fr var(--val);
		gap: var(--gap);
		align-items: start;
	}

	.axis-track {
		grid-column: 2;
		position: relative;
		height: 100%;
		border-top: 1px solid rgb(255 255 255 / 0.22);
		padding-top: 8px;
	}

	.tick {
		position: absolute;
		top: 8px;
		transform: translateX(-50%);
		font-size: var(--text-tick);
		color: rgb(255 255 255 / 0.6);
	}

	.fact {
		margin: 0;
		font-size: clamp(20px, 1.5vw, 28px);
		line-height: 1.35;
		color: #fff;
		border-left: 4px solid #2ea043;
		padding-left: 18px;
	}

	.fact-key {
		color: #2ea043;
		font-weight: 700;
		margin-right: 10px;
	}

	.hands {
		margin: 0;
		font-size: var(--text-small);
		color: rgb(255 255 255 / 0.55);
		padding-left: 22px;
	}

	/* On a phone the label column would starve the axis, so each row stacks:
	   option and share on one line, a full width bar beneath. The chimp line and
	   the ticks follow the track across, so 33 percent still means 33 percent. */
	@media (max-width: 760px) {
		.wrap {
			--lab: 0px;
			--val: 0px;
			--gap: 0px;
			--axis-h: 34px;
		}

		.rows {
			gap: 16px;
		}

		.row {
			grid-template-columns: 1fr auto;
			grid-template-areas:
				'label value'
				'track track';
			row-gap: 6px;
			column-gap: 12px;
		}

		.label {
			grid-area: label;
			text-align: left;
			font-size: 17px;
		}

		.value {
			grid-area: value;
			font-size: 17px;
		}

		.track {
			grid-area: track;
			height: 26px;
		}

		.axis {
			grid-template-columns: 1fr;
		}

		.axis-track {
			grid-column: 1;
		}

		/* Four ticks collide at this width; the quarters carry the scale. */
		.tick:nth-child(2),
		.tick:nth-child(4) {
			display: none;
		}

		.tick:first-child {
			transform: none;
		}

		.tick:last-child {
			transform: translateX(-100%);
		}

		.chimp-label {
			font-size: 14px;
		}
	}
</style>
