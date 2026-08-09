<script>
	import { onDestroy } from 'svelte';
	import { QUESTIONS, N_QUESTIONS, QUIZ_META, scoreOf, submitResponse } from '$lib/quiz.js';

	/**
	 * The phone page. One question per screen, three targets, no names, no
	 * cookies, no analytics, nothing fetched at paint time. Everything it needs
	 * is in the bundle, so the first question is on screen before the network
	 * has finished thinking about it.
	 */

	/** @type {number[]} chosen option index per question, -1 = unanswered */
	let answers = $state(Array(N_QUESTIONS).fill(-1));
	let step = $state(0);
	let done = $state(false);
	/** brief lockout so a double tap cannot skip a question */
	let locked = $state(false);
	let submitted = false;
	let timer = 0;

	const q = $derived(QUESTIONS[step]);
	const score = $derived(scoreOf(answers));

	function choose(i) {
		if (locked || done) return;
		answers[step] = i;

		const last = step === N_QUESTIONS - 1;
		locked = true;
		timer = setTimeout(
			() => {
				locked = false;
				if (last) finish();
				else step += 1;
			},
			// Long enough to see the tap register, short enough to feel instant.
			220
		);
	}

	function back() {
		if (done || locked || step === 0) return;
		step -= 1;
	}

	function finish() {
		done = true;
		// Submit exactly once, and never wait for it: the score is already known
		// locally, so the result screen paints whatever the network does.
		if (submitted) return;
		submitted = true;
		submitResponse(answers.slice());
	}

	onDestroy(() => clearTimeout(timer));
</script>

<svelte:head>
	<title>Five questions · Four Years Left</title>
	<meta name="theme-color" content="#0B1B3F" />
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
	{#if !done}
		<header>
			<div class="dots" role="progressbar" aria-valuemin="1" aria-valuemax={N_QUESTIONS} aria-valuenow={step + 1} aria-label="Question {step + 1} of {N_QUESTIONS}">
				{#each QUESTIONS as _, i}
					<span class="dot" class:on={i === step} class:filled={answers[i] !== -1}></span>
				{/each}
			</div>
			<p class="count">Question {step + 1} of {N_QUESTIONS}</p>
		</header>

		<div class="stage">
			{#key step}
				<h1>{q.text}</h1>

				<div class="options">
					{#each q.options as opt, i}
						<button
							type="button"
							class="option"
							class:chosen={answers[step] === i}
							onclick={() => choose(i)}
							aria-pressed={answers[step] === i}
						>
							<span class="letter" aria-hidden="true">{['A', 'B', 'C'][i]}</span>
							<span class="text">{opt}</span>
						</button>
					{/each}
				</div>
			{/key}
		</div>

		<footer>
			{#if step > 0}
				<button type="button" class="back" onclick={back}>← Back</button>
			{/if}
			<p class="promise">Anonymous. No name, no login, nothing stored but your five answers.</p>
		</footer>
	{:else}
		<div class="stage result">
			<p class="eyebrow">{QUIZ_META.title}</p>
			<p class="big tabular">You got {score} of {N_QUESTIONS}</p>
			<p class="lookup">Look up at the big screen.</p>
		</div>
	{/if}
</main>

<style>
	:global(html),
	:global(body) {
		background: #0b1b3f;
	}

	main {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--color-navy);
		color: #fff;
		padding: max(18px, env(safe-area-inset-top)) 20px max(20px, env(safe-area-inset-bottom));
		gap: 18px;
	}

	/* ---- header: dots and the count ------------------------------- */

	header {
		flex: 0 0 auto;
	}

	.dots {
		display: flex;
		gap: 10px;
		margin-bottom: 12px;
	}

	.dot {
		flex: 1 1 0;
		height: 6px;
		border-radius: 3px;
		background: rgb(255 255 255 / 0.22);
		transition: background 180ms ease;
	}

	.dot.filled {
		background: rgb(255 255 255 / 0.5);
	}

	.dot.on {
		background: var(--color-un-blue);
	}

	.count {
		font-size: 18px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.62);
		margin: 0;
	}

	/* ---- the question --------------------------------------------- */

	.stage {
		flex: 1 1 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: clamp(20px, 4vh, 36px);
	}

	h1 {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(26px, 6.6vw, 40px);
		line-height: 1.14;
		margin: 0;
		text-wrap: balance;
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.option {
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		min-height: 76px;
		padding: 16px 18px;
		border: 2px solid transparent;
		border-radius: 14px;
		background: #fff;
		color: var(--color-navy);
		font-family: var(--font-body);
		font-size: clamp(19px, 4.6vw, 23px);
		font-weight: 600;
		line-height: 1.25;
		text-align: left;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition:
			transform 120ms ease,
			background 140ms ease;
	}

	.option:active {
		transform: scale(0.985);
	}

	.option .letter {
		flex: 0 0 auto;
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: var(--color-paper-alt);
		color: var(--color-ink-muted);
		font-size: 18px;
		font-weight: 700;
	}

	.option.chosen {
		background: var(--color-un-blue);
		border-color: #fff;
		color: #fff;
	}

	.option.chosen .letter {
		background: rgb(255 255 255 / 0.9);
		color: var(--color-navy);
	}

	/* ---- footer ---------------------------------------------------- */

	footer {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}

	.back {
		min-height: 48px;
		padding: 10px 18px 10px 0;
		background: none;
		border: 0;
		color: #fff;
		font-family: var(--font-body);
		font-size: 18px;
		font-weight: 600;
		cursor: pointer;
	}

	.promise {
		flex: 1 1 220px;
		margin: 0;
		font-size: 18px;
		line-height: 1.35;
		color: rgb(255 255 255 / 0.55);
		text-align: right;
	}

	/* ---- the score screen ------------------------------------------ */

	.result {
		text-align: center;
		align-items: center;
	}

	.eyebrow {
		font-size: 18px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-un-blue);
		margin: 0;
	}

	.big {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(38px, 10vw, 64px);
		line-height: 1.05;
		margin: 0;
	}

	.lookup {
		font-size: clamp(21px, 5.4vw, 26px);
		color: rgb(255 255 255 / 0.82);
		margin: 0;
	}
</style>
