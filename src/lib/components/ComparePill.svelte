<script>
	import CountrySearch from './CountrySearch.svelte';
	import { compare, QUICK_ADD } from '$lib/stores/compare.svelte.js';

	let open = $state(false);
</script>

<div class="pill-wrap">
	{#if open}
		<div class="panel">
			<div class="panel-head">
				<p class="title">Compare countries</p>
				<button class="close" onclick={() => (open = false)} aria-label="Close comparison panel">
					×
				</button>
			</div>

			<p class="hint">
				Up to {compare.max}. Each keeps its color on every chart in the story.
			</p>

			{#if !compare.isFull}
				<CountrySearch
					compact
					onselect={(name) => compare.add(name)}
					placeholder="Type three letters, press enter…"
				/>
			{:else}
				<p class="full">Three is the maximum. Remove one to add another.</p>
			{/if}

			{#if compare.list.length}
				<div class="chips">
					{#each compare.entries as e}
						<span class="chip" style="--c:{e.color}">
							<span class="dot" style="background:{e.color}"></span>
							{e.name}
							<button onclick={() => compare.remove(e.name)} aria-label="Remove {e.name}">×</button>
						</span>
					{/each}
				</div>
				<button class="clear" onclick={() => compare.clear()}>Clear all</button>
			{/if}

			<p class="quick-label">Quick add</p>
			<div class="quick">
				{#each QUICK_ADD as name}
					<button
						class="quick-btn"
						class:on={compare.has(name)}
						disabled={!compare.has(name) && compare.isFull}
						onclick={() => compare.toggle(name)}
					>
						{name}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<button class="pill" onclick={() => (open = !open)} aria-expanded={open}>
		<span class="pill-label">Compare</span>
		{#if compare.list.length}
			<span class="dots">
				{#each compare.entries as e}
					<span class="dot" style="background:{e.color}"></span>
				{/each}
			</span>
		{/if}
	</button>
</div>

<style>
	.pill-wrap {
		position: fixed;
		right: 22px;
		bottom: 22px;
		z-index: 70;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 10px;
	}

	.pill {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-body);
		color: #fff;
		background: var(--color-navy);
		border: 0;
		border-radius: 999px;
		padding: 12px 22px;
		cursor: pointer;
		box-shadow: 0 8px 26px rgb(11 27 63 / 0.32);
	}

	.pill:hover {
		background: var(--color-un-blue);
	}

	.dots {
		display: flex;
		gap: 4px;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: inline-block;
	}

	.panel {
		width: 340px;
		background: #fff;
		border-radius: 10px;
		padding: 18px;
		box-shadow: 0 16px 44px rgb(11 27 63 / 0.28);
		border: 1px solid var(--color-rule);
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 22px;
		margin: 0;
	}

	.close {
		border: 0;
		background: none;
		font-size: 26px;
		line-height: 1;
		cursor: pointer;
		color: var(--color-ink-muted);
	}

	.hint,
	.full {
		font-size: var(--text-micro);
		color: var(--color-ink-muted);
		margin: 4px 0 12px;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 12px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: var(--text-micro);
		font-weight: 600;
		padding: 6px 8px 6px 10px;
		border-radius: 999px;
		border: 1.5px solid var(--c);
		color: var(--color-ink);
	}

	.chip button {
		border: 0;
		background: none;
		cursor: pointer;
		font-size: 17px;
		line-height: 1;
		color: var(--color-ink-muted);
		padding: 0 2px;
	}

	.clear {
		margin-top: 10px;
		font-size: var(--text-micro);
		background: none;
		border: 0;
		color: var(--color-un-blue);
		text-decoration: underline;
		cursor: pointer;
		padding: 2px 0;
	}

	.quick-label {
		font-size: var(--text-micro);
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-muted);
		margin: 16px 0 8px;
	}

	.quick {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.quick-btn {
		font-size: var(--text-micro);
		padding: 6px 11px;
		border-radius: 999px;
		border: 1px solid var(--color-rule);
		background: #fff;
		cursor: pointer;
	}

	.quick-btn:hover:not(:disabled) {
		border-color: var(--color-un-blue);
		color: var(--color-un-blue);
	}

	.quick-btn.on {
		background: var(--color-navy);
		color: #fff;
		border-color: var(--color-navy);
	}

	.quick-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	@media print {
		.pill-wrap {
			display: none;
		}
	}
</style>
