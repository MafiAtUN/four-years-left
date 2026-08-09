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
	import { textSafe } from '$lib/tokens';

	let { accent = 'var(--color-un-blue)', active = true, eyebrow = '', children } = $props();

	// The bar carries the true series color; the label has to be readable.
	const eyebrowColor = $derived(
		accent.startsWith('var(') ? 'var(--color-link)' : textSafe(accent)
	);
</script>

<div class="card" class:dim={!active} style="--accent:{accent}; --eyebrow:{eyebrowColor}">
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

	/* Steps that are not current recede by losing their lift, not by fading.
	   Fading text to 0.62 dropped the eyebrow below WCAG AA, and since steps
	   sit a full viewport apart only one card is ever really in view, so the
	   dimming bought nothing. Emphasis by fading still governs chart series. */
	.dim {
		box-shadow: 0 1px 2px rgb(11 27 63 / 0.08);
	}

	.eyebrow {
		font-size: var(--text-micro);
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--eyebrow);
		margin: 0 0 8px;
	}

	.body {
		font-size: var(--text-caption);
		line-height: 1.45;
		color: var(--color-ink);
		margin: 0;
	}
</style>
