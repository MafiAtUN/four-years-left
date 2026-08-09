<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { stops } from '$lib/stores/stops.svelte.js';
	import { motion } from '$lib/stores/motion.svelte.js';

	/** The nine scenes of the talk, for the rail and the digit keys. The quiz
	    is not among them: it is its own screen, one key away. */
	const SCENES = [
		[1, 'The promise'],
		[2, 'The long good news'],
		[3, 'The stall'],
		[4, 'The report card'],
		[5, 'Seventeen goals'],
		[6, 'The geography of progress'],
		[7, 'Three portraits'],
		[8, 'Nobody has finished'],
		[9, 'Four years, then the floor']
	];

	let blanked = $state(false);
	let helpOpen = $state(false);
	let currentScene = $state(1);

	function isTyping(e) {
		const t = e.target;
		return (
			t instanceof HTMLElement &&
			(t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
		);
	}

	function onKeydown(e) {
		if (isTyping(e)) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;

		const k = e.key;

		// B blanks the screen to navy when you want eyes on you, not the slide.
		if (k === 'b' || k === 'B') {
			e.preventDefault();
			blanked = !blanked;
			return;
		}
		if (blanked && k !== 'Escape') {
			e.preventDefault();
			blanked = false;
			return;
		}

		if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') {
			e.preventDefault();
			stops.next();
		} else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') {
			e.preventDefault();
			stops.prev();
		} else if (k === 'Home') {
			e.preventDefault();
			stops.toTop();
		} else if (k === 'End') {
			e.preventDefault();
			stops.scrollToIndex(stops.ordered.length - 1);
		} else if (k === '0') {
			// The quiz lives on its own screen now, so 0 crosses to it rather
			// than scrolling to it.
			e.preventDefault();
			goto(`${base}/quiz/results`);
		} else if (k >= '1' && k <= '9') {
			e.preventDefault();
			stops.toScene(Number(k));
		} else if (k === 's' || k === 'S') {
			// Same cue as before: the room's score, whoever has answered by now.
			e.preventDefault();
			goto(`${base}/quiz/results#score`);
		} else if (k === 'f' || k === 'F') {
			e.preventDefault();
			if (document.fullscreenElement) document.exitFullscreen();
			else document.documentElement.requestFullscreen?.();
		} else if (k === '?' || (k === '/' && e.shiftKey)) {
			e.preventDefault();
			helpOpen = !helpOpen;
		} else if (k === 'Escape') {
			helpOpen = false;
			blanked = false;
		}
	}

	onMount(() => {
		motion.init();
		let frame = 0;
		const onScroll = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				stops.syncFromScroll();
				currentScene = stops.currentScene;
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('keydown', onKeydown);
		onScroll();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<!-- Progress rail: where you are in the hour, and an escape hatch during Q&A. -->
<nav class="rail" aria-label="Story progress">
	{#each SCENES as [n, label]}
		<button
			class="dot"
			class:on={currentScene === n}
			onclick={() => stops.toScene(n)}
			aria-label="Scene {n}: {label}"
			aria-current={currentScene === n ? 'true' : undefined}
		>
			<span class="tip">{n}. {label}</span>
		</button>
	{/each}
</nav>

{#if blanked}
	<button
		class="blank"
		onclick={() => (blanked = false)}
		aria-label="Screen blanked. Click or press any key to resume."
	></button>
{/if}

{#if helpOpen}
	<div class="help" role="dialog" aria-label="Keyboard shortcuts">
		<h2>Presenting</h2>
		<dl>
			<dt>→ space pgdn</dt><dd>Next stop</dd>
			<dt>← pgup</dt><dd>Previous stop</dd>
			<dt>1 – 9</dt><dd>Jump to scene</dd>
			<dt>Home / End</dt><dd>Top / end</dd>
			<dt>0</dt><dd>The quiz screen</dd>
			<dt>S</dt><dd>The room's score</dd>
			<dt>F</dt><dd>Fullscreen</dd>
			<dt>B</dt><dd>Blank the screen</dd>
			<dt>?</dt><dd>This panel</dd>
		</dl>
		<button onclick={() => (helpOpen = false)}>Close</button>
	</div>
{/if}

<style>
	.rail {
		position: fixed;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 60;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.dot {
		position: relative;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid rgb(11 27 63 / 0.35);
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	.dot.on {
		background: var(--color-un-blue);
		border-color: var(--color-un-blue);
		transform: scale(1.35);
	}

	.tip {
		position: absolute;
		right: 22px;
		top: 50%;
		transform: translateY(-50%);
		white-space: nowrap;
		background: var(--color-navy);
		color: #fff;
		font-size: var(--text-micro);
		padding: 5px 10px;
		border-radius: 4px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 160ms ease;
	}

	.dot:hover .tip,
	.dot:focus-visible .tip {
		opacity: 1;
	}

	.blank {
		position: fixed;
		inset: 0;
		z-index: 200;
		background: var(--color-navy);
		border: 0;
		cursor: pointer;
	}

	.help {
		position: fixed;
		right: 22px;
		bottom: 84px;
		z-index: 80;
		background: #fff;
		border: 1px solid var(--color-rule);
		border-radius: 10px;
		padding: 20px 24px;
		box-shadow: 0 16px 44px rgb(11 27 63 / 0.28);
		max-width: 340px;
	}

	.help h2 {
		font-size: 24px;
		margin: 0 0 12px;
	}

	.help dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 6px 16px;
		margin: 0 0 14px;
		font-size: var(--text-micro);
	}

	.help dt {
		font-weight: 700;
		color: var(--color-navy);
	}

	.help dd {
		margin: 0;
		color: var(--color-ink-muted);
	}

	.help button {
		font-size: var(--text-micro);
		border: 1px solid var(--color-rule);
		border-radius: 4px;
		padding: 5px 12px;
		background: none;
		cursor: pointer;
	}

	@media print {
		.rail,
		.help {
			display: none;
		}
	}
</style>
