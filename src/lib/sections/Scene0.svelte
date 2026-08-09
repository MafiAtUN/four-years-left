<script>
	import { onMount } from 'svelte';
	import { stops } from '$lib/stores/stops.svelte.js';
	import { room } from '$lib/stores/quizroom.svelte.js';
	import QuizInvite from '$lib/components/QuizInvite.svelte';
	import QuizReveal from '$lib/components/QuizReveal.svelte';
	import QuizSummary from '$lib/components/QuizSummary.svelte';
	import { QUESTIONS, N_QUESTIONS } from '$lib/quiz.js';

	/**
	 * Scene 0. The briefing opens with the room answering five questions on their
	 * phones, then watching their own answers come back at them.
	 *
	 * Seven stops: the invitation, one reveal per question, the room's score.
	 * Built on the same sticky plus steps mechanics as Scroller, rather than
	 * Scroller itself, because this scene has no caption column: the whole
	 * viewport is the slide, and each stop replaces it entirely.
	 */

	const LABELS = [
		'The invitation',
		...QUESTIONS.map((_, i) => `Question ${i + 1}`),
		"The room's score"
	];

	let index = $state(0);
	/** @type {HTMLElement[]} */
	let stepEls = $state([]);
	let sectionEl = $state(null);
	let toast = $state(false);

	const tally = $derived(room.tally);

	onMount(() => {
		const unregisters = stepEls
			.filter(Boolean)
			.map((el, i) => stops.register(el, { scene: 0, label: LABELS[i] }));

		let frame = 0;
		const update = () => {
			frame = 0;
			const anchor = window.innerHeight * 0.55;
			let next = 0;
			for (let i = 0; i < stepEls.length; i++) {
				const el = stepEls[i];
				if (el && el.getBoundingClientRect().top <= anchor) next = i;
			}
			if (next !== index) index = next;
		};
		const onScroll = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });

		// Poll only while this scene is on screen. The other nine scenes make no
		// network calls at all.
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) room.start();
				else room.stop();
			},
			{ rootMargin: '200px' }
		);
		io.observe(sectionEl);

		// Hidden wipe: shift+R twice inside two seconds, for the gap between
		// rehearsal and 12:30. Deliberately undiscoverable by accident.
		let lastR = 0;
		let toastTimer = 0;
		const onKey = (e) => {
			if (!e.shiftKey || (e.key !== 'R' && e.key !== 'r')) return;
			const t = e.target;
			if (t instanceof HTMLElement && (t.tagName === 'INPUT' || t.isContentEditable)) return;
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
		window.addEventListener('keydown', onKey);

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			window.removeEventListener('keydown', onKey);
			if (frame) cancelAnimationFrame(frame);
			clearTimeout(toastTimer);
			io.disconnect();
			room.stop();
			unregisters.forEach((fn) => fn());
		};
	});
</script>

<section id="quiz" bind:this={sectionEl} aria-label="Before we start: five questions">
	<div class="sticky">
		<div class="panel">
			{#if index === 0}
				<!-- State A, the invitation -->
				<QuizInvite live={room.live} count={room.count} />
			{:else if index <= N_QUESTIONS}
				<!-- States B to F, one reveal per question -->
				<div class="reveal">
					{#key index}
						<QuizReveal
							question={QUESTIONS[index - 1]}
							n={index}
							total={N_QUESTIONS}
							row={tally.perQuestion[index - 1]}
							live={room.live}
						/>
					{/key}
				</div>
			{:else}
				<!-- State G, the room's score -->
				<QuizSummary {tally} live={room.live} />
			{/if}
		</div>

		{#if toast}
			<p class="toast" aria-live="polite">Room cleared</p>
		{/if}
	</div>

	<!-- Invisible spacers: each one is a presentation stop, so the arrow keys
	     walk the reveal one question at a time. -->
	<div class="steps" aria-hidden="true">
		{#each LABELS as _, i}
			<div class="step" bind:this={stepEls[i]} data-step={i}></div>
		{/each}
	</div>
</section>

<style>
	section {
		position: relative;
		background: var(--color-navy);
		color: #fff;
	}

	.sticky {
		position: sticky;
		top: var(--header-h);
		height: calc(100vh - var(--header-h));
		overflow: hidden;
	}

	.panel {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(20px, 3.5vh, 44px) clamp(24px, 4vw, 72px);
	}

	.steps {
		position: relative;
		margin-top: -100vh;
		pointer-events: none;
	}

	.step {
		min-height: 100vh;
	}

	.step:last-child {
		min-height: 110vh;
	}

	/* ---- States B to F --------------------------------------------- */

	.reveal {
		width: 100%;
		height: 100%;
		max-width: 1500px;
		margin: 0 auto;
	}

	/* The question is the headline of its own slide, so it outgrows the standard
	   chart title. Everything else keeps the site's chart furniture. */
	.reveal :global(.chart-title) {
		font-size: clamp(26px, 2.3vw, 46px);
	}

	/* ---- presenter only -------------------------------------------- */

	.toast {
		position: absolute;
		left: 20px;
		bottom: 18px;
		margin: 0;
		font-size: var(--text-micro);
		color: rgb(255 255 255 / 0.5);
	}

	@media (max-width: 900px) {
		.panel {
			padding: 20px;
		}
		.invite {
			flex-direction: column;
			gap: 24px;
		}
		.qr-card img {
			width: min(46vw, 240px);
		}
		.copy {
			max-width: none;
		}
		.summary {
			max-width: none;
		}
	}

	@media print {
		.sticky {
			position: static;
			height: auto;
		}
		.steps {
			display: none;
		}
	}
</style>
