<script>
	/**
	 * Big number callout. The value is always passed in from derived_stats.json,
	 * never typed into the markup.
	 *
	 * @type {{
	 *   value: string,
	 *   unit?: string,
	 *   label: string,
	 *   note?: string,
	 *   accent?: string
	 * }}
	 */
	let { value, unit = '', label, note = '', accent = 'var(--color-un-blue)' } = $props();
</script>

<div class="stat" style="--accent:{accent}">
	<p class="value tabular display">
		{value}{#if unit}<span class="unit">{unit}</span>{/if}
	</p>
	<hr />
	<p class="label">{label}</p>
	{#if note}<p class="note">{note}</p>{/if}
</div>

<style>
	.stat {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.value {
		font-size: clamp(56px, 6vw, 92px);
		line-height: 1;
		color: var(--accent);
		margin: 0;
		font-weight: 800;
	}

	.unit {
		font-size: 0.5em;
		margin-left: 2px;
		font-weight: 700;
	}

	hr {
		height: 3px;
		width: 48px;
		background: var(--accent);
		border: 0;
		margin: 16px 0 12px;
	}

	.label {
		font-size: var(--text-body);
		line-height: 1.35;
		color: var(--color-ink);
		margin: 0;
		font-weight: 600;
	}

	.note {
		font-size: var(--text-small);
		color: var(--color-ink-muted);
		margin: 6px 0 0;
	}
</style>
