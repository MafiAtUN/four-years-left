<script>
	import { motion } from '$lib/stores/motion.svelte.js';
	import { stops } from '$lib/stores/stops.svelte.js';
</script>

<header>
	<button class="brand" onclick={() => stops.toTop()}>Four Years Left</button>

	<nav>
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

	@media print {
		header {
			display: none;
		}
	}
</style>
