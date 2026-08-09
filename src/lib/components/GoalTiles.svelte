<script>
	import { DASH, DASH_LABEL, SDG, GOAL_NAMES, TREND_GLYPH, TREND_LABEL } from '$lib/tokens';

	/**
	 * A country's 17 goal dashboard. Each tile is filled with its rating color,
	 * carries a band in its official SDG color, and shows the trend arrow.
	 *
	 * @type {{
	 *   rec: any,
	 *   cols?: number,
	 *   size?: number,
	 *   emphasize?: string[],
	 *   title?: string
	 * }}
	 */
	let { rec, cols = 6, size = 62, emphasize = [], title = '' } = $props();

	const tiles = $derived(
		Array.from({ length: 17 }, (_, i) => ({
			n: i + 1,
			d: rec.dash[i],
			t: rec.trend[i]
		}))
	);

	// When a step emphasizes some ratings, the rest recede rather than vanish.
	const isDim = (t) => emphasize.length > 0 && !emphasize.includes(t.d);

	/** Rating colors are dark enough for white glyphs except the yellow. */
	const fg = (d) => (d === 'y' ? '#4A3B00' : d === 'x' ? '#3C4451' : '#fff');
</script>

<div class="tiles" style="--cols:{cols}; --size:{size}px">
	{#if title}<p class="tiles-title">{title}</p>{/if}
	<div class="grid">
		{#each tiles as t}
			<div
				class="tile"
				class:dim={isDim(t)}
				style="background:{DASH[t.d]}; color:{fg(t.d)}"
				title="SDG {t.n}: {GOAL_NAMES[t.n]} — {DASH_LABEL[t.d]}, {TREND_LABEL[t.t]}"
			>
				<span class="band" style="background:{SDG[t.n]}"></span>
				<span class="num tabular">{t.n}</span>
				<span class="glyph" aria-hidden="true">{TREND_GLYPH[t.t]}</span>
				<span class="sr">SDG {t.n} {GOAL_NAMES[t.n]}: {DASH_LABEL[t.d]}, {TREND_LABEL[t.t]}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.tiles {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.tiles-title {
		font-size: var(--text-small);
		font-weight: 700;
		margin: 0;
		color: var(--color-ink);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(var(--cols), var(--size));
		gap: 5px;
	}

	.tile {
		position: relative;
		width: var(--size);
		height: var(--size);
		border-radius: 4px;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 4px 5px;
		overflow: hidden;
		transition:
			opacity 400ms ease,
			transform 300ms ease;
	}

	.dim {
		opacity: 0.28;
	}

	.band {
		position: absolute;
		inset: 0 0 auto 0;
		height: 5px;
	}

	.num {
		font-size: var(--text-micro);
		font-weight: 800;
		font-family: var(--font-display);
		line-height: 1;
	}

	.glyph {
		font-size: var(--text-micro);
		font-weight: 700;
		line-height: 1;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
