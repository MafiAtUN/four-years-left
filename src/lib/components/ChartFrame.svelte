<script>
	import { SOURCE_LINE } from '$lib/tokens';

	/**
	 * Atlas chart furniture, applied to every chart on the site without exception:
	 * a bold finding as the title, a plain subtitle naming the measure and units,
	 * a thin accent rule, the chart, then a source line.
	 *
	 * The optional table view doubles as the accessibility story for every chart.
	 *
	 * @type {{
	 *   title: string,
	 *   subtitle?: string,
	 *   source?: string,
	 *   accent?: string,
	 *   dark?: boolean,
	 *   children: import('svelte').Snippet,
	 *   table?: import('svelte').Snippet
	 * }}
	 */
	let {
		title,
		subtitle = '',
		source = SOURCE_LINE,
		accent = 'var(--color-un-blue)',
		dark = false,
		children,
		table
	} = $props();

	let showTable = $state(false);
</script>

<figure class="frame" class:dark>
	<figcaption class="head">
		<h3 class="chart-title">{title}</h3>
		{#if subtitle}<p class="chart-subtitle">{subtitle}</p>{/if}
		<hr class="chart-rule" style="background:{accent}" />
	</figcaption>

	<div class="body">
		{#if showTable && table}
			<div class="table-wrap">{@render table()}</div>
		{:else}
			{@render children()}
		{/if}
	</div>

	<div class="foot">
		<p class="chart-source">Source: {source}</p>
		{#if table}
			<button type="button" onclick={() => (showTable = !showTable)}>
				{showTable ? 'View as chart' : 'View as table'}
			</button>
		{/if}
	</div>
</figure>

<style>
	.frame {
		margin: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.head {
		flex: 0 0 auto;
	}

	.body {
		flex: 1 1 auto;
		min-height: 0;
		position: relative;
	}

	.foot {
		flex: 0 0 auto;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}

	.foot button {
		font-size: var(--text-micro);
		color: var(--color-ink-muted);
		border: 1px solid var(--color-rule);
		border-radius: 4px;
		padding: 4px 10px;
		background: transparent;
		white-space: nowrap;
		cursor: pointer;
	}

	.foot button:hover {
		border-color: var(--color-un-blue);
		color: var(--color-link);
	}

	.table-wrap {
		max-height: 100%;
		overflow: auto;
	}

	/* Dark variant for charts sitting on the navy. */
	.dark :global(.chart-title) {
		color: #fff;
	}
	.dark :global(.chart-subtitle),
	.dark :global(.chart-source) {
		color: rgb(255 255 255 / 0.68);
	}
	.dark .foot button {
		color: rgb(255 255 255 / 0.68);
		border-color: rgb(255 255 255 / 0.28);
	}
</style>
