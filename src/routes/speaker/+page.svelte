<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { HOST } from '$lib/host.js';
	import { SPEAKER } from '$lib/speaker.js';

	/**
	 * The speaker, between the quiz and the briefing.
	 *
	 * The quiz score hands over to this screen and this screen hands over to the
	 * hero, so the opening runs quiz, who is talking, then the talk. Same keys
	 * as the rest of the deck: forward goes on to the briefing, back returns to
	 * the room's score.
	 */

	const displayUrl = SPEAKER.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

	// #score is read by the quiz screen's script, not an anchor, so it is reached
	// by navigation rather than a link the prerenderer would try to resolve.
	const toScore = () => goto(`${base}/quiz/results/#score`);

	function onKeydown(e) {
		const t = e.target;
		if (t instanceof HTMLElement && (t.tagName === 'INPUT' || t.isContentEditable)) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;

		const k = e.key;
		if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') {
			e.preventDefault();
			goto(`${base}/`);
		} else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') {
			e.preventDefault();
			toScore();
		} else if (k === '0') {
			e.preventDefault();
			goto(`${base}/quiz/results/`);
		} else if (k === 'f' || k === 'F') {
			e.preventDefault();
			if (document.fullscreenElement) document.exitFullscreen();
			else document.documentElement.requestFullscreen?.();
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
	<title>{SPEAKER.name} · Four Years Left · {HOST.programme}</title>
	<meta name="theme-color" content="#0B1B3F" />
</svelte:head>

<main>
	<header>
		<p class="where">
			<span class="mark">{HOST.programme}</span>
			Your speaker
		</p>
		<a class="to-briefing" href="{base}/">Go to the briefing →</a>
	</header>

	<section class="stage">
		<div class="profile">
			<div class="who">
				<div class="id">
					<img
						class="photo"
						src="{base}/{SPEAKER.photo}"
						alt="Portrait of {SPEAKER.name}"
						width="512"
						height="512"
					/>
					<div>
						<h1>{SPEAKER.name}</h1>
						<p class="role">{SPEAKER.role}</p>
						<p class="office">{SPEAKER.office}</p>
					</div>
				</div>

				<ul class="record">
					{#each SPEAKER.record as line}
						<li>{line}</li>
					{/each}
				</ul>

				<div class="creds">
					<p class="label">Education and certifications</p>
					<ul class="chips">
						<li class="chip degree">{SPEAKER.degree}</li>
						{#each SPEAKER.certifications as cert}
							<li class="chip">{cert}</li>
						{/each}
					</ul>
				</div>
			</div>

			<!-- The code is for the room; the card is a link for anyone reading
			     this page on their own screen afterwards. -->
			<a class="qr" href={SPEAKER.linkedin} target="_blank" rel="noreferrer">
				<span class="qr-card">
					<img src="{base}/qr-linkedin.svg" alt="QR code linking to {displayUrl}" />
				</span>
				<span class="qr-label">Connect on LinkedIn</span>
				<span class="url">{displayUrl}</span>
			</a>
		</div>
	</section>

	<footer>
		<button type="button" class="nav" onclick={toScore}>← Quiz score</button>
		<a class="start" href="{base}/">Start the briefing →</a>
	</footer>
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
	}

	/* ---- header, matched to the quiz screen ------------------------- */

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
		font-family: var(--font-display);
		font-weight: 800;
		color: #fff;
		border-left: 4px solid var(--color-un-blue);
		padding-left: 12px;
		margin-right: 6px;
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

	/* ---- the profile ------------------------------------------------ */

	.stage {
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: clamp(24px, 4vh, 56px) clamp(20px, 4vw, 72px);
	}

	.profile {
		display: flex;
		align-items: center;
		gap: clamp(36px, 5vw, 96px);
		max-width: 1500px;
		width: 100%;
	}

	.who {
		flex: 1 1 auto;
		min-width: 0;
	}

	.id {
		display: flex;
		align-items: center;
		gap: clamp(20px, 2.4vw, 40px);
	}

	.photo {
		flex: 0 0 auto;
		width: clamp(120px, 10vw, 190px);
		height: auto;
		border-radius: 50%;
		border: 4px solid var(--color-un-blue);
	}

	h1 {
		font-size: clamp(40px, 4.2vw, 80px);
		line-height: 1;
		margin: 0;
	}

	.role {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(22px, 1.6vw, 30px);
		line-height: 1.2;
		color: var(--color-un-blue);
		margin: 14px 0 0;
	}

	.office {
		font-size: clamp(19px, 1.35vw, 24px);
		line-height: 1.35;
		color: rgb(255 255 255 / 0.8);
		margin: 6px 0 0;
	}

	.record {
		list-style: none;
		padding: 0;
		margin: clamp(28px, 4vh, 48px) 0 0;
		display: grid;
		gap: 12px;
		max-width: 74ch;
	}

	.record li {
		position: relative;
		padding-left: 26px;
		font-size: clamp(20px, 1.3vw, 25px);
		line-height: 1.4;
		color: rgb(255 255 255 / 0.9);
	}

	.record li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.6em;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--color-un-blue);
	}

	.creds {
		margin: clamp(28px, 4vh, 44px) 0 0;
	}

	.label {
		font-size: var(--text-small);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.6);
		margin: 0 0 14px;
	}

	.chips {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.chip {
		font-size: clamp(18px, 1.2vw, 22px);
		font-weight: 600;
		border: 2px solid rgb(255 255 255 / 0.32);
		border-radius: 999px;
		padding: 8px 18px;
	}

	.chip.degree {
		background: #fff;
		border-color: #fff;
		color: var(--color-navy);
	}

	/* ---- LinkedIn --------------------------------------------------- */

	.qr {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		color: #fff;
	}

	.qr-card {
		display: block;
		background: #fff;
		border-radius: 18px;
		padding: clamp(14px, 1.6vw, 26px);
		line-height: 0;
	}

	.qr-card img {
		display: block;
		width: min(34vh, 20vw, 360px);
		min-width: 200px;
		height: auto;
	}

	.qr-label {
		margin: 18px 0 0;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: clamp(22px, 1.7vw, 30px);
	}

	.url {
		margin: 4px 0 0;
		font-size: clamp(17px, 1.25vw, 24px);
		font-weight: 600;
		color: rgb(255 255 255 / 0.75);
	}

	.qr:hover .url {
		color: var(--color-un-blue);
	}

	/* ---- footer ----------------------------------------------------- */

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
		display: inline-flex;
		align-items: center;
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

	.nav:hover {
		border-color: #fff;
		background: rgb(255 255 255 / 0.08);
	}

	.start {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-lede);
		background: #fff;
		color: var(--color-navy);
		border-radius: 999px;
		padding: 12px 32px;
		text-decoration: none;
		white-space: nowrap;
	}

	.start:hover {
		background: var(--color-un-blue);
		color: #fff;
	}

	@media (max-width: 900px) {
		header {
			flex-direction: column;
			gap: 6px;
		}

		.profile {
			flex-direction: column;
			align-items: stretch;
		}

		.id {
			flex-direction: column;
			align-items: flex-start;
		}

		.qr-card img {
			width: min(56vw, 240px);
			min-width: 0;
		}

		.start {
			font-size: var(--text-body);
			padding: 12px 22px;
		}
	}
</style>
