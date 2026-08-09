<script>
	import { onMount } from 'svelte';
	import { stops } from '$lib/stores/stops.svelte.js';

	/**
	 * Sticky chart, scrolling caption steps over it. The pattern every scrolly
	 * on this page copies.
	 *
	 * Hand built rather than @sveltejs/svelte-scroller because the presentation
	 * layer needs every step to register itself as an addressable stop and to be
	 * driven programmatically by the arrow keys. Same semantics as the Atlas
	 * component: the active state is a pure function of scroll position.
	 *
	 * @type {{
	 *   scene: number,
	 *   count: number,
	 *   index?: number,
	 *   labels?: string[],
	 *   side?: 'left' | 'right',
	 *   chart: import('svelte').Snippet<[number]>,
	 *   step: import('svelte').Snippet<[number]>
	 * }}
	 */
	let {
		scene,
		count,
		index = $bindable(0),
		labels = [],
		side = 'left',
		chart,
		step
	} = $props();

	/** @type {HTMLElement[]} */
	let stepEls = $state([]);
	let outer = $state(null);

	onMount(() => {
		// Each step is a presentation stop, in document order.
		const unregisters = stepEls
			.filter(Boolean)
			.map((el, i) => stops.register(el, { scene, label: labels[i] ?? `Step ${i + 1}` }));

		let frame = 0;
		const update = () => {
			frame = 0;
			// The active step is the last one whose top has crossed the anchor
			// line at 55% of the viewport. Pure function of scroll position, so
			// pausing mid state is stable while talking.
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

		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (frame) cancelAnimationFrame(frame);
			unregisters.forEach((fn) => fn());
		};
	});
</script>

<div class="scroller" bind:this={outer}>
	<div class="sticky-chart">
		{@render chart(index)}
	</div>

	<div class="steps" class:right={side === 'right'}>
		{#each Array(count) as _, i}
			<div class="step" bind:this={stepEls[i]} data-step={i}>
				<div class="step-inner" aria-hidden={i !== index ? 'true' : 'false'}>
					{@render step(i)}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.scroller {
		position: relative;
	}

	.sticky-chart {
		position: sticky;
		top: var(--header-h);
		height: calc(100vh - var(--header-h));
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	/* Steps scroll over the sticky chart. */
	.steps {
		position: relative;
		margin-top: -100vh;
		pointer-events: none;
	}

	.step {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0 clamp(16px, 4vw, 64px);
	}

	.steps.right .step {
		justify-content: flex-end;
	}

	.step-inner {
		width: min(440px, 92vw);
		pointer-events: auto;
	}

	/* The last step needs room to settle before the next section arrives. */
	.step:last-child {
		min-height: 110vh;
	}

	@media (max-width: 780px) {
		.step {
			align-items: flex-end;
			padding-bottom: 8vh;
		}
		.step-inner {
			width: 100%;
		}
	}
</style>
