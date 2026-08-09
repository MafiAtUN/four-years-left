<script>
	import { onMount } from 'svelte';
	import { stops } from '$lib/stores/stops.svelte.js';

	/**
	 * A scene of the story. Registers its own top edge as a presentation stop
	 * so the arrow keys and the progress rail can address it.
	 *
	 * @type {{
	 *   scene: number,
	 *   id: string,
	 *   label: string,
	 *   dark?: boolean,
	 *   full?: boolean,
	 *   children: import('svelte').Snippet
	 * }}
	 */
	let { scene, id, label, dark = false, full = false, children } = $props();

	let el = $state(null);

	onMount(() => stops.register(el, { scene, label }));
</script>

<section {id} bind:this={el} class:dark class:full aria-label={label}>
	{@render children()}
</section>

<style>
	section {
		position: relative;
		background: var(--color-paper);
		scroll-margin-top: 0;
	}

	.dark {
		background: var(--color-navy);
		color: #fff;
	}

	.full {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
