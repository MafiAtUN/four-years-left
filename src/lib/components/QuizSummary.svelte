<script>
	import { CHIMP } from '$lib/quiz-config.js';
	import { N_QUESTIONS } from '$lib/quiz.js';

	/**
	 * The room's score against the chimpanzee's 33 percent.
	 *
	 * Shared by Scene 0 in the deck and by the standalone results page, so the
	 * headline number and the handoff line can never drift apart between the two
	 * screens you might be presenting from.
	 *
	 * @type {{ tally: any, live: boolean }}
	 */
	let { tally, live } = $props();

	// Null when nobody has answered, which is not the same as zero: an empty
	// room shows the benchmark rather than claiming the room scored nothing.
	const share = $derived(live ? tally.meanShare : null);
</script>

<div class="summary">
	<p class="eyebrow">{share != null ? "The room's score" : 'The benchmark'}</p>

	{#if share != null}
		<p class="mega tabular">{Math.round(share * 100)}%</p>
		<p class="mega-label">
			of the room's answers were right, an average of
			<span class="tabular">{tally.meanScore.toFixed(1)}</span>
			out of {N_QUESTIONS} across {tally.scored}
			{tally.scored === 1 ? 'person' : 'people'}.
		</p>

		<div class="versus">
			<div class="vs-row">
				<span class="vs-label">This room</span>
				<span class="vs-track"
					><span class="vs-bar you" style="width:{Math.min(100, share * 100)}%"></span></span
				>
				<span class="vs-val tabular">{Math.round(share * 100)}%</span>
			</div>
			<div class="vs-row">
				<span class="vs-label">A chimpanzee</span>
				<span class="vs-track"
					><span class="vs-bar chimp" style="width:{CHIMP * 100}%"></span></span
				>
				<span class="vs-val tabular">33%</span>
			</div>
		</div>
	{:else}
		<p class="mega tabular">33%</p>
		<p class="mega-label">
			is what a chimpanzee scores on these five questions, picking bananas at random. Educated
			audiences have been scoring below the chimps for twenty years.
		</p>
	{/if}

	<p class="handoff">
		You are not wrong because you did not study. The world changed while nobody was looking. The
		next nine pages are the update.
	</p>
</div>

<style>
	.summary {
		max-width: 1100px;
	}

	.eyebrow {
		font-size: var(--text-small);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-un-blue);
		margin: 0 0 14px;
	}

	.mega {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(96px, 15vw, 260px);
		line-height: 0.86;
		margin: 8px 0 0;
		color: var(--color-un-blue);
	}

	.mega-label {
		font-size: clamp(20px, 1.6vw, 30px);
		line-height: 1.4;
		color: rgb(255 255 255 / 0.85);
		margin: 20px 0 0;
		max-width: 54ch;
	}

	.versus {
		margin: 30px 0 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 900px;
	}

	.vs-row {
		display: grid;
		grid-template-columns: clamp(140px, 14vw, 220px) 1fr 76px;
		align-items: center;
		gap: 18px;
	}

	.vs-label {
		font-size: var(--text-body);
		color: rgb(255 255 255 / 0.8);
		text-align: right;
	}

	.vs-track {
		height: 30px;
		background: rgb(255 255 255 / 0.07);
		border-radius: 3px;
	}

	.vs-bar {
		display: block;
		height: 100%;
		border-radius: 3px;
		transition: width 900ms cubic-bezier(0.22, 0.61, 0.36, 1);
	}

	.vs-bar.you {
		background: var(--color-un-blue);
	}

	.vs-bar.chimp {
		background: rgb(255 255 255 / 0.3);
	}

	.vs-val {
		font-size: var(--text-body);
		font-weight: 700;
		color: rgb(255 255 255 / 0.85);
	}

	.handoff {
		font-size: clamp(21px, 1.7vw, 32px);
		line-height: 1.35;
		color: #fff;
		margin: 40px 0 0;
		max-width: 56ch;
		border-left: 4px solid var(--color-un-blue);
		padding-left: 20px;
	}

	@media (max-width: 900px) {
		.summary {
			max-width: none;
		}
	}
</style>
