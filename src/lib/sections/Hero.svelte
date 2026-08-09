<script>
	import { onMount } from 'svelte';
	import { scaleLinear } from 'd3-scale';
	import Section from '$lib/components/Section.svelte';
	import { countries, fmt1 } from '$lib/data';
	import { motion } from '$lib/stores/motion.svelte.js';
	import { HERO_RAMP, scoreBin } from '$lib/tokens';

	/** One particle per ranked country. The decoration is the data all along. */
	const list = Object.entries(countries).map(([name, rec]) => ({ name, score: rec.score }));

	let revealed = $state(false);
	let canvas = $state(null);
	let box = $state({ w: 1200, h: 700 });

	const best = list.reduce((a, b) => (b.score > a.score ? b : a));
	const worst = list.reduce((a, b) => (b.score < a.score ? b : a));

	onMount(() => {
		const ctx = canvas.getContext('2d');
		let raf = 0;
		let parts = [];
		let dpr = Math.min(2, window.devicePixelRatio || 1);

		function resize() {
			const r = canvas.parentElement.getBoundingClientRect();
			box = { w: r.width, h: r.height };
			canvas.width = Math.floor(r.width * dpr);
			canvas.height = Math.floor(r.height * dpr);
			canvas.style.width = r.width + 'px';
			canvas.style.height = r.height + 'px';
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			layout();
		}

		/** Beeswarm targets: x by score, y dodged so nothing overlaps. */
		function layout() {
			// Once the data is revealed the swarm is a chart, not a backdrop, so it
			// clears the text: on a wide screen it starts to the right of the
			// narrowed title column, on a narrow one it drops below the copy.
			// Otherwise every country under about 45 hides behind the headline,
			// which is exactly the end of the scale worth pointing at.
			const wide = box.w >= 900;
			const padR = revealed && !wide ? 40 : Math.max(70, box.w * 0.05);
			const x0 = revealed
				? wide
					? Math.max(box.w * 0.44, 460)
					: 40
				: Math.max(70, box.w * 0.09);
			const x1 = box.w - padR;
			const x = scaleLinear().domain([0, 100]).range([x0, x1]);
			const cy = revealed && !wide ? box.h * 0.62 : box.h * 0.52;
			// A phone gives the swarm a third of the width, so the dots shrink or
			// the dodge stacks them into a tower taller than the screen.
			const rad = wide ? 5.5 : 3.4;
			const r = rad + 0.5;
			const sorted = [...parts].sort((a, b) => a.score - b.score);
			/** @type {number[][]} occupied y bands per particle, greedy dodge */
			const placed = [];
			for (const p of sorted) {
				const px = x(p.score);
				let k = 0;
				let py = cy;
				// Alternate above and below the axis until a free slot is found.
				while (
					placed.some((q) => Math.abs(q.x - px) < r * 2 && Math.abs(q.y - py) < r * 2) &&
					k < 60
				) {
					k++;
					const step = Math.ceil(k / 2) * (r * 2 + 1);
					py = cy + (k % 2 === 0 ? step : -step);
				}
				p.tx = px;
				p.ty = py;
				p.r = rad;
				placed.push({ x: px, y: py });
			}
			// Axis geometry for the reveal state.
			axis = { x, y: cy, x0, x1 };
		}

		let axis = null;

		function init() {
			parts = list.map((d) => ({
				name: d.name,
				score: d.score,
				x: Math.random() * box.w,
				y: Math.random() * box.h,
				vx: (Math.random() - 0.5) * 0.28,
				vy: (Math.random() - 0.5) * 0.28,
				tx: 0,
				ty: 0,
				r: 5.5,
				color: HERO_RAMP[scoreBin(d.score)]
			}));
			layout();
		}

		function frame() {
			ctx.clearRect(0, 0, box.w, box.h);

			if (revealed && axis) {
				// axis line and ticks, so the beeswarm reads as a real chart
				ctx.strokeStyle = 'rgba(255,255,255,0.28)';
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(axis.x0 - 20, axis.y + 132);
				ctx.lineTo(axis.x1 + 20, axis.y + 132);
				ctx.stroke();
				ctx.fillStyle = 'rgba(255,255,255,0.72)';
				ctx.font = '16px Inter, system-ui, sans-serif';
				ctx.textAlign = 'center';
				for (const t of [0, 25, 50, 75, 100]) {
					const tx = axis.x(t);
					ctx.beginPath();
					ctx.moveTo(tx, axis.y + 132);
					ctx.lineTo(tx, axis.y + 139);
					ctx.stroke();
					ctx.fillText(String(t), tx, axis.y + 160);
				}
				ctx.fillText('SDG Index score, 0 to 100', (axis.x0 + axis.x1) / 2, axis.y + 190);
			}

			for (const p of parts) {
				if (revealed) {
					const ease = motion.reduced ? 0.35 : 0.09;
					p.x += (p.tx - p.x) * ease;
					p.y += (p.ty - p.y) * ease;
				} else {
					p.x += p.vx;
					p.y += p.vy;
					if (p.x < 8 || p.x > box.w - 8) p.vx *= -1;
					if (p.y < 8 || p.y > box.h - 8) p.vy *= -1;
				}

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fillStyle = p.color;
				ctx.shadowColor = p.color;
				ctx.shadowBlur = revealed ? 6 : 12;
				ctx.globalAlpha = revealed ? 0.98 : 0.8;
				ctx.fill();
				ctx.shadowBlur = 0;
				ctx.globalAlpha = 1;
			}

			// call out the two extremes once the swarm has settled
			if (revealed) {
				ctx.font = '700 16px Inter, system-ui, sans-serif';
				ctx.fillStyle = '#fff';

				// The leader sits at the far right with empty margin beside it, so its
				// label points outward. The last country sits at the start of the axis
				// with the title column beyond it, so its label goes above the dot
				// rather than reaching back into the text.
				// Centered labels are clamped to the canvas so a name never runs off
				// the edge of a phone screen.
				const centered = (text, x, y) => {
					const half = ctx.measureText(text).width / 2 + 8;
					ctx.textAlign = 'center';
					ctx.fillText(text, Math.max(half, Math.min(box.w - half, x)), y);
				};

				const roomForSideLabel = box.w >= 900;
				const pBest = parts.find((q) => q.name === best.name);
				if (pBest) {
					const text = `${best.name} ${fmt1(best.score)}`;
					if (roomForSideLabel) {
						ctx.textAlign = 'left';
						ctx.fillText(text, pBest.x + 12, pBest.y + 5);
					} else {
						centered(text, pBest.x, pBest.y + 24);
					}
				}

				const pWorst = parts.find((q) => q.name === worst.name);
				if (pWorst) {
					centered(`${worst.name} ${fmt1(worst.score)}`, pWorst.x, pWorst.y - 16);
				}
			}

			raf = requestAnimationFrame(frame);
		}

		init();
		resize();
		frame();
		relayout = layout;
		const ro = new ResizeObserver(resize);
		ro.observe(canvas.parentElement);

		return () => {
			cancelAnimationFrame(raf);
			relayout = null;
			ro.disconnect();
		};
	});

	// Revealing changes where the swarm belongs, not just how it moves, so the
	// targets are recomputed on the toggle as well as on resize.
	let relayout = $state(null);
	$effect(() => {
		revealed;
		relayout?.();
	});
</script>

<Section scene={1} id="hero" label="Four Years Left" dark>
	<div class="hero">
		<div class="canvas-wrap">
			<canvas bind:this={canvas} aria-hidden="true"></canvas>
		</div>

		<div class="content" class:pushed={revealed}>
			<p class="kicker">UN Briefing · Emory, NYU and Columbia visit</p>
			<h1>Four Years Left</h1>
			<p class="standfirst">
				In September 2015, 193 countries adopted 17 goals with a 2030 deadline. We are eleven years
				in, with four years to go.
			</p>

			<div class="controls">
				<button class="toggle" onclick={() => (revealed = !revealed)} aria-pressed={revealed}>
					{revealed ? 'Hide the data' : 'Reveal the data'}
				</button>
				<p class="hint">
					{#if revealed}
						Every dot is one of the {list.length} ranked countries, placed by its SDG Index score: a
						0 to 100 grade averaging performance across all 17 goals.
					{:else}
						{list.length} dots are drifting behind this text. They are not decoration.
					{/if}
				</p>
			</div>

			<p class="byline">
				Mafizul Islam · United Nations Headquarters, room GA1B33<br />
				Data: Sustainable Development Report 2026 (Fuller, Iablonovski, Lafortune and Sachs)
			</p>
		</div>

		<div class="scroll-cue" aria-hidden="true">
			<span>Scroll</span>
			<svg width="20" height="26" viewBox="0 0 20 26" fill="none">
				<path d="M10 2 L10 20 M4 14 L10 21 L16 14" stroke="currentColor" stroke-width="2" />
			</svg>
		</div>
	</div>
</Section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.canvas-wrap {
		position: absolute;
		inset: 0;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}

	.content {
		position: relative;
		z-index: 2;
		padding: clamp(32px, 6vw, 96px);
		max-width: 900px;
		transition:
			transform 700ms ease,
			max-width 700ms ease;
	}

	/* When the swarm appears the text column narrows and the chart takes the
	   space to its right, so no country sits behind the headline. */
	.pushed {
		max-width: min(560px, 32vw);
	}

	.kicker {
		font-size: var(--text-small);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-un-blue);
		margin: 0 0 18px;
	}

	h1 {
		font-size: clamp(64px, 9vw, 132px);
		line-height: 0.94;
		margin: 0;
		color: #fff;
		text-shadow: 0 4px 40px rgb(11 27 63 / 0.85);
	}

	.standfirst {
		font-size: var(--text-lede);
		line-height: 1.45;
		color: rgb(255 255 255 / 0.88);
		max-width: 46ch;
		margin: 24px 0 0;
		text-shadow: 0 2px 20px rgb(11 27 63 / 0.9);
	}

	.controls {
		margin: 32px 0 0;
		display: flex;
		align-items: flex-start;
		gap: 20px;
		flex-wrap: wrap;
	}

	.toggle {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-body);
		color: var(--color-navy);
		background: #fff;
		border: 0;
		border-radius: 999px;
		padding: 12px 28px;
		cursor: pointer;
		white-space: nowrap;
	}

	.toggle:hover {
		background: var(--color-un-blue);
		color: #fff;
	}

	.hint {
		font-size: var(--text-small);
		color: rgb(255 255 255 / 0.78);
		max-width: 40ch;
		margin: 0;
		text-shadow: 0 2px 18px rgb(11 27 63 / 0.9);
	}

	.byline {
		font-size: var(--text-micro);
		color: rgb(255 255 255 / 0.62);
		margin: 40px 0 0;
		line-height: 1.6;
	}

	.scroll-cue {
		position: absolute;
		bottom: 44px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		color: rgb(255 255 255 / 0.6);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		font-size: var(--text-micro);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	@media (max-width: 900px) {
		/* No room for a column beside the chart. The text keeps its full width and
		   the prose stands down while the chart is up, since a phone screen cannot
		   hold both and a swarm behind a paragraph is worse than either alone.
		   The toggle brings every word straight back. */
		.pushed {
			max-width: none;
		}

		.pushed .standfirst,
		.pushed .hint,
		.pushed .byline {
			display: none;
		}

		/* Title to the top, chart below it, rather than both fighting for the
		   middle of the screen. */
		.hero:has(.pushed) {
			align-items: flex-start;
		}

		/* Clear the sticky header, which would otherwise sit on the kicker. */
		.pushed {
			padding-top: calc(var(--header-h) + 18px);
		}
	}
</style>
