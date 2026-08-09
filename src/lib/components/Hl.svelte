<script>
	/**
	 * A color highlighted word inside a caption. This is the legend: the word
	 * carries the exact color of the series it names, so no chart on this site
	 * needs a legend box.
	 *
	 * @type {{ c: string, children: import('svelte').Snippet }}
	 */
	import { textSafe } from '$lib/tokens';

	let { c, children } = $props();
</script>

<strong style="color:{textSafe(c)}">{@render children()}</strong>

<style>
	strong {
		font-weight: 700;
	}
</style>
