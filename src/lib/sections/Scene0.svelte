<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { stops } from '$lib/stores/stops.svelte.js';
	import { room } from '$lib/stores/quizroom.svelte.js';
	import QuizReveal from '$lib/components/QuizReveal.svelte';
	import { QUESTIONS, N_QUESTIONS, QUIZ_META } from '$lib/quiz.js';
	import { QUIZ_URL, CHIMP } from '$lib/quiz-config.js';

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

	const displayUrl = QUIZ_URL.replace(/^https?:\/\//, '');
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
				<div class="invite">
					<div class="qr-col">
						<div class="qr-card">
							<img src="{base}/qr-quiz.svg" alt="QR code linking to {displayUrl}" />
						</div>
						<p class="url">{displayUrl}</p>
					</div>

					<div class="copy">
						<p class="eyebrow">Before we start</p>
						<h2>{QUIZ_META.title}</h2>
						<p class="lede">From your head, not from Google. Completely anonymous.</p>

						{#if room.live}
							<p class="counter">
								<span class="counter-n tabular">{room.count}</span>
								<span class="counter-label"
									>{room.count === 1 ? 'answer' : 'answers'} so far</span
								>
							</p>
						{/if}

						<p class="note">
							Five questions, about a minute. Nothing is stored but the five answers, and we
							look at them together on this screen.
						</p>
					</div>
				</div>
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
				{@const share = room.live ? tally.meanShare : null}
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
									><span class="vs-bar you" style="width:{Math.min(100, share * 100)}%"></span
									></span
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
							is what a chimpanzee scores on these five questions, picking bananas at random.
							Educated audiences have been scoring below the chimps for twenty years.
						</p>
					{/if}

					<p class="handoff">
						You are not wrong because you did not study. The world changed while nobody was looking.
						The next nine pages are the update.
					</p>
				</div>
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

	/* ---- State A, the invitation ----------------------------------- */

	.invite {
		display: flex;
		align-items: center;
		gap: clamp(32px, 5vw, 88px);
		flex-wrap: wrap;
		justify-content: center;
		max-width: 1500px;
	}

	.qr-card {
		background: #fff;
		border-radius: 18px;
		padding: clamp(14px, 1.6vw, 26px);
		line-height: 0;
	}

	.qr-card img {
		display: block;
		width: min(42vh, 30vw, 460px);
		min-width: 220px;
		height: auto;
	}

	.url {
		margin: 16px 0 0;
		text-align: center;
		font-size: clamp(17px, 1.25vw, 24px);
		font-weight: 600;
		letter-spacing: 0.01em;
		color: rgb(255 255 255 / 0.9);
		overflow-wrap: anywhere;
	}

	.copy {
		max-width: 42ch;
	}

	.eyebrow {
		font-size: var(--text-small);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-un-blue);
		margin: 0 0 14px;
	}

	h2 {
		font-size: clamp(40px, 4.4vw, 84px);
		line-height: 1.02;
		margin: 0;
		text-wrap: balance;
	}

	.lede {
		font-size: clamp(22px, 1.85vw, 34px);
		line-height: 1.35;
		color: #fff;
		margin: 22px 0 0;
	}

	.counter {
		display: flex;
		align-items: baseline;
		gap: 14px;
		margin: 28px 0 0;
	}

	.counter-n {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(52px, 5vw, 96px);
		line-height: 1;
		color: var(--color-un-blue);
	}

	.counter-label {
		font-size: clamp(19px, 1.4vw, 26px);
		color: rgb(255 255 255 / 0.75);
	}

	.note {
		font-size: var(--text-small);
		color: rgb(255 255 255 / 0.55);
		margin: 26px 0 0;
		max-width: 40ch;
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

	/* ---- State G ---------------------------------------------------- */

	.summary {
		max-width: 1100px;
		text-align: left;
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
