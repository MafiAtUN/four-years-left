<script>
	import { onMount, onDestroy } from 'svelte';
	import { base } from '$app/paths';
	import { room } from '$lib/stores/quizroom.svelte.js';
	import QuizInvite from '$lib/components/QuizInvite.svelte';
	import QuizReveal from '$lib/components/QuizReveal.svelte';
	import QuizSummary from '$lib/components/QuizSummary.svelte';
	import { QUESTIONS, N_QUESTIONS } from '$lib/quiz.js';

	/**
	 * The quiz as its own screen.
	 *
	 * Same seven states as Scene 0 and the same components, but driven by
	 * buttons as well as keys and ending in a door into the briefing rather than
	 * a scroll into it. Use this when you want the quiz to be a separate act:
	 * project it, run it, then click through to the main page and begin.
	 */

	const LAST = N_QUESTIONS + 1;
	const LABELS = [
		'Invitation',
		...QUESTIONS.map((_, i) => `Q${i + 1}`),
		'Score'
	];

	let step = $state(0);
	let toast = $state(false);
	let toastTimer = 0;

	const tally = $derived(room.tally);

	const next = () => (step = Math.min(LAST, step + 1));
	const prev = () => (step = Math.max(0, step - 1));

	function onKeydown(e) {
		const t = e.target;
		if (t instanceof HTMLElement && (t.tagName === 'INPUT' || t.isContentEditable)) return;
		if (e.metaKey || e.ctrlKey || e.altKey) {
			return;
		}

		const k = e.key;
		if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') {
			e.preventDefault();
			next();
		} else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') {
			e.preventDefault();
			prev();
		} else if (k === 'Home') {
			e.preventDefault();
			step = 0;
		} else if (k === 'End' || k === 's' || k === 'S') {
			// Same cue as in the deck: close the quiz whenever you decide to.
			e.preventDefault();
			step = LAST;
		} else if (k >= '1' && k <= '5') {
			e.preventDefault();
			step = Number(k);
		} else if (k === 'f' || k === 'F') {
			e.preventDefault();
			if (document.fullscreenElement) document.exitFullscreen();
			else document.documentElement.requestFullscreen?.();
		}
	}

	onMount(() => {
		room.start();

		// S from the deck arrives here asking for the score, not the invitation.
		if (location.hash === '#score') step = LAST;

		// The hidden wipe, identical to the deck's, for the gap between rehearsal
		// and the real room.
		let lastR = 0;
		const onKeyR = (e) => {
			if (!e.shiftKey || (e.key !== 'R' && e.key !== 'r')) return;
			const now = Date.now();
			if (now - lastR < 2000) {
				lastR = 0;
				room.reset().then(() => {
					if (!room.enabled) return;
					toast = true;
					clearTimeout(toastTimer);
					toastTimer = setTimeout(() => (toast = false), 1800);
				});
			} else {
				lastR = now;
			}
		};

		window.addEventListener('keydown', onKeydown);
		window.addEventListener('keydown', onKeyR);
		return () => {
			window.removeEventListener('keydown', onKeydown);
			window.removeEventListener('keydown', onKeyR);
		};
	});

	onDestroy(() => {
		clearTimeout(toastTimer);
		room.stop();
	});
</script>

<svelte:head>
	<title>Room results · Four Years Left · SUNIA</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
	<header>
		<p class="where">
			<img class="mark" src="{base}/sunia-logo-white.png" alt="SUNIA" width="334" height="386" />
			Room results
			{#if room.live}<span class="count tabular">· {room.count} answered</span>{/if}
		</p>
		<a class="to-briefing" href="{base}/">Go to the briefing →</a>
	</header>

	<section class="stage">
		{#if step === 0}
			<QuizInvite live={room.live} count={room.count} showResultsLink={false} />
		{:else if step <= N_QUESTIONS}
			{#key step}
				<div class="reveal">
					<QuizReveal
						question={QUESTIONS[step - 1]}
						n={step}
						total={N_QUESTIONS}
						row={tally.perQuestion[step - 1]}
						live={room.live}
					/>
				</div>
			{/key}
		{:else}
			<div class="closing">
				<QuizSummary {tally} live={room.live} />
				<a class="start" href="{base}/">Start the briefing →</a>
			</div>
		{/if}
	</section>

	<footer>
		<button type="button" class="nav" onclick={prev} disabled={step === 0}>← Back</button>

		<div class="dots" aria-label="Quiz progress">
			{#each LABELS as label, i}
				<button
					type="button"
					class="dot"
					class:on={i === step}
					onclick={() => (step = i)}
					aria-label={label}
					aria-current={i === step ? 'true' : undefined}
				></button>
			{/each}
		</div>

		<button type="button" class="nav" onclick={next} disabled={step === LAST}>Next →</button>
	</footer>

	{#if toast}
		<p class="toast" aria-live="polite">Room cleared</p>
	{/if}
</main>

<style>
	:global(html),
	:global(body) {
		background: #0b1b3f;
	}

	main {
		position: relative;
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--color-navy);
		color: #fff;
	}

	header {
		flex: 0 0 auto;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding: 16px clamp(20px, 3vw, 44px);
		border-bottom: 1px solid rgb(255 255 255 / 0.12);
	}

	.where {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		font-size: var(--text-small);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.6);
	}

	.mark {
		width: auto;
		height: 40px;
	}

	.count {
		color: var(--color-un-blue);
		margin-left: 6px;
	}

	.to-briefing {
		font-size: var(--text-small);
		font-weight: 600;
		color: rgb(255 255 255 / 0.75);
		text-decoration: none;
		border-bottom: 1px solid rgb(255 255 255 / 0.3);
		padding-bottom: 2px;
	}

	.to-briefing:hover {
		color: #fff;
		border-color: #fff;
	}

	.stage {
		flex: 1 1 auto;
		min-height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(20px, 3vh, 44px) clamp(20px, 4vw, 72px);
	}

	.reveal {
		width: 100%;
		height: 100%;
		max-width: 1500px;
	}

	.reveal :global(.chart-title) {
		font-size: clamp(26px, 2.3vw, 46px);
	}

	.closing {
		width: 100%;
		max-width: 1100px;
	}

	.start {
		display: inline-block;
		margin-top: 36px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-lede);
		background: #fff;
		color: var(--color-navy);
		border-radius: 999px;
		padding: 14px 34px;
		text-decoration: none;
	}

	.start:hover {
		background: var(--color-un-blue);
		color: #fff;
	}

	footer {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 14px clamp(20px, 3vw, 44px) 22px;
		border-top: 1px solid rgb(255 255 255 / 0.12);
	}

	.nav {
		min-height: 48px;
		padding: 10px 22px;
		border: 1px solid rgb(255 255 255 / 0.35);
		border-radius: 999px;
		background: none;
		color: #fff;
		font-family: var(--font-body);
		font-size: var(--text-small);
		font-weight: 600;
		cursor: pointer;
	}

	.nav:hover:not(:disabled) {
		border-color: #fff;
		background: rgb(255 255 255 / 0.08);
	}

	.nav:disabled {
		opacity: 0.32;
		cursor: default;
	}

	.dots {
		display: flex;
		gap: 12px;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid rgb(255 255 255 / 0.4);
		background: none;
		padding: 0;
		cursor: pointer;
	}

	.dot.on {
		background: var(--color-un-blue);
		border-color: var(--color-un-blue);
		transform: scale(1.3);
	}

	.toast {
		position: absolute;
		left: clamp(20px, 3vw, 44px);
		bottom: 74px;
		margin: 0;
		font-size: var(--text-micro);
		color: rgb(255 255 255 / 0.5);
	}

	@media (max-width: 760px) {
		.stage {
			padding: 16px;
		}
		footer {
			padding: 12px 16px 18px;
		}
		.nav {
			padding: 10px 14px;
		}
	}
</style>
