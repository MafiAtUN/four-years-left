<script>
	import { base } from '$app/paths';
	import { QUIZ_META } from '$lib/quiz.js';
	import { QUIZ_URL } from '$lib/quiz-config.js';

	/**
	 * The invitation: scan this, answer five questions, watch them come back.
	 *
	 * Shared by Scene 0 in the deck and by the standalone results page, so
	 * whichever screen you project, the room sees the same code and the same
	 * promise of anonymity.
	 *
	 * @type {{ live: boolean, count: number, showResultsLink?: boolean }}
	 */
	let { live, count, showResultsLink = true } = $props();

	const displayUrl = QUIZ_URL.replace(/^https?:\/\//, '');
</script>

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

		{#if live}
			<p class="counter">
				<span class="counter-n tabular">{count}</span>
				<span class="counter-label">{count === 1 ? 'answer' : 'answers'} so far</span>
			</p>
		{/if}

		<!-- For anyone on a laptop, and for you when a camera will not cooperate. -->
		<div class="ways-in">
			<a class="btn primary" href="{base}/quiz">Open the quiz</a>
			{#if showResultsLink}
				<a class="btn ghost" href="{base}/quiz/results">Live results</a>
			{/if}
		</div>

		<p class="note">
			Five questions, about a minute. Nothing is stored but the five answers, and we look at them
			together on this screen.
		</p>
	</div>
</div>

<style>
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

	.ways-in {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
		margin: 28px 0 0;
	}

	.btn {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-body);
		border-radius: 999px;
		padding: 12px 28px;
		text-decoration: none;
		white-space: nowrap;
	}

	.btn.primary {
		background: #fff;
		color: var(--color-navy);
	}

	.btn.primary:hover {
		background: var(--color-un-blue);
		color: #fff;
	}

	.btn.ghost {
		border: 2px solid rgb(255 255 255 / 0.4);
		color: #fff;
	}

	.btn.ghost:hover {
		border-color: #fff;
	}

	.note {
		font-size: var(--text-small);
		color: rgb(255 255 255 / 0.55);
		margin: 26px 0 0;
		max-width: 40ch;
	}

	@media (max-width: 900px) {
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
	}
</style>
