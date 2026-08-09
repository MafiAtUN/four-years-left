<script>
	import { base } from '$app/paths';
	import { motion } from '$lib/stores/motion.svelte.js';
	import { stops } from '$lib/stores/stops.svelte.js';
</script>

<header>
	<button class="brand" onclick={() => stops.toTop()}>Four Years Left</button>

	<nav>
		<a class="quiz-link" href="{base}/quiz/results">Quiz</a>
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

	.brand {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: var(--text-body);
		white-space: nowrap;
		color: var(--color-navy);
		background: none;
		border: 0;
		cursor: pointer;
		padding: 0;
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
			gap: 10px;
			padding-inline: 14px;
		}

		nav {
			gap: 12px;
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
