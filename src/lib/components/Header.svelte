<script>
	import { base } from '$app/paths';
	import { motion } from '$lib/stores/motion.svelte.js';
	import { stops } from '$lib/stores/stops.svelte.js';
	import { HOST } from '$lib/host.js';
</script>

<header>
	<button class="brand" onclick={() => stops.toTop()}>
		<span class="words">
			<span class="host">{HOST.programme}</span>
			<span class="title">Four Years Left</span>
		</span>
	</button>

	<nav>
		<a class="quiz-link" href="{base}/quiz/results">Quiz</a>
		<a class="link" href="{base}/speaker/">Speaker</a>
		<button
			class="link"
			onclick={() => motion.toggle()}
			aria-pressed={motion.reduced}
			title="Swap animated transitions for crossfades"
		>
			{motion.reduced ? 'Motion: reduced' : 'Motion: full'}
		</button>
		<a class="link" href="#about">About</a>
	</nav>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 10px clamp(16px, 3vw, 32px);
		background: rgb(255 255 255 / 0.88);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--color-rule);
	}

	/* The programme's name sits above the talk's title, in that order: this is
	   an Io Sono Futuro page first and a deck second. A UN blue bar stands in
	   for a logo. */
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		border-left: 4px solid var(--color-un-blue);
		padding-left: 10px;
		text-align: left;
		background: none;
		border: 0;
		cursor: pointer;
		padding: 0;
	}

	.words {
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}

	.host {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-micro);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-ink-muted);
	}

	.title {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: var(--text-body);
		white-space: nowrap;
		color: var(--color-navy);
	}

	nav {
		display: flex;
		align-items: center;
		gap: 18px;
	}

	.link {
		font-size: var(--text-micro);
		color: var(--color-ink-muted);
		background: none;
		border: 0;
		cursor: pointer;
		text-decoration: none;
		padding: 4px;
	}

	.link:hover {
		color: var(--color-link);
	}

	/* The way into the quiz from anywhere in the story, so the opening act is
	   never more than one click away during Q&A. */
	.quiz-link {
		font-size: var(--text-micro);
		font-weight: 700;
		color: var(--color-navy);
		text-decoration: none;
		border: 1px solid var(--color-rule);
		border-radius: 999px;
		padding: 5px 14px;
	}

	.quiz-link:hover {
		border-color: var(--color-un-blue);
		color: var(--color-link);
	}

	/* On a phone the bar has room for the title and one destination. The About
	   link is an anchor into the endmatter, which scrolling reaches anyway. */
	@media (max-width: 620px) {
		header {
			gap: 8px;
			padding-inline: 12px;
		}

		/* Quiz, Speaker and the motion toggle share the row with the title, so
		   each keeps to one line and the spacing tightens to make room. */
		nav {
			gap: 6px;
		}

		.link {
			white-space: nowrap;
			padding-inline: 2px;
		}

		.quiz-link {
			padding-inline: 11px;
		}

		nav :global(a[href$='#about']) {
			display: none;
		}
	}

	@media print {
		header {
			display: none;
		}
	}
</style>
