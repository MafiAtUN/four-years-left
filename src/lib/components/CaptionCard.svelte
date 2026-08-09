<script>
	/**
	 * Atlas caption card: white, colored left bar, never more than two sentences.
	 * Key words inside are highlighted in the exact series color they refer to,
	 * which is what replaces legend boxes everywhere on this site.
	 *
	 * @type {{
	 *   accent?: string,
	 *   active?: boolean,
	 *   eyebrow?: string,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { accent = 'var(--color-un-blue)', active = true, eyebrow = '', children } = $props();
</script>

<div class="card" class:dim={!active} style="--accent:{accent}">
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}
	<p class="body">{@render children()}</p>
</div>

<style>
	.card {
		background: #fff;
		border-left: 6px solid var(--accent);
		border-radius: 4px;
		padding: 20px 24px;
		box-shadow:
			0 1px 2px rgb(11 27 63 / 0.08),
			0 8px 28px rgb(11 27 63 / 0.14);
		transition: opacity 400ms ease;
	}

	/* Steps that are not current stay legible but recede: the Atlas move of
	   emphasis by fading everything else. */
	.dim {
		opacity: 0.32;
	}

	.eyebrow {
		font-size: var(--text-micro);
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
		margin: 0 0 8px;
	}

	.body {
		font-size: var(--text-caption);
		line-height: 1.45;
		color: var(--color-ink);
		margin: 0;
	}
</style>
