<script>
	import { countryNames } from '$lib/data';

	/**
	 * Type ahead over the 169 ranked countries. Three letters and enter is the
	 * whole interaction, because it happens live in front of a room.
	 *
	 * @type {{
	 *   value?: string,
	 *   onselect: (name: string) => void,
	 *   placeholder?: string,
	 *   compact?: boolean
	 * }}
	 */
	let { value = '', onselect, placeholder = 'Search countries…', compact = false } = $props();

	let query = $state('');
	let open = $state(false);
	let active = $state(0);
	let inputEl = $state(null);

	const matches = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return countryNames.slice(0, 8);
		const starts = [];
		const contains = [];
		for (const n of countryNames) {
			const l = n.toLowerCase();
			if (l.startsWith(q)) starts.push(n);
			else if (l.includes(q)) contains.push(n);
		}
		return [...starts, ...contains].slice(0, 8);
	});

	function choose(name) {
		if (!name) return;
		onselect(name);
		query = '';
		open = false;
		active = 0;
		inputEl?.blur();
	}

	function onKeydown(e) {
		// Keep the presentation shortcuts out of the search box.
		e.stopPropagation();
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			open = true;
			active = Math.min(matches.length - 1, active + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = Math.max(0, active - 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			choose(matches[active]);
		} else if (e.key === 'Escape') {
			open = false;
			inputEl?.blur();
		}
	}
</script>

<div class="search" class:compact>
	<input
		bind:this={inputEl}
		bind:value={query}
		type="text"
		role="combobox"
		aria-expanded={open}
		aria-controls="country-listbox"
		aria-autocomplete="list"
		aria-label="Search countries"
		{placeholder}
		onfocus={() => (open = true)}
		onblur={() => setTimeout(() => (open = false), 160)}
		oninput={() => {
			open = true;
			active = 0;
		}}
		onkeydown={onKeydown}
	/>

	{#if open && matches.length}
		<ul id="country-listbox" role="listbox">
			{#each matches as name, i}
				<li role="option" aria-selected={i === active}>
					<button
						type="button"
						class:active={i === active}
						onmousedown={(e) => {
							e.preventDefault();
							choose(name);
						}}
						onmouseenter={() => (active = i)}
					>
						{name}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.search {
		position: relative;
		width: 100%;
	}

	input {
		width: 100%;
		font-family: var(--font-body);
		font-size: var(--text-body);
		padding: 12px 16px;
		border: 2px solid var(--color-navy);
		border-radius: 6px;
		background: #fff;
		color: var(--color-ink);
	}

	.compact input {
		font-size: var(--text-small);
		padding: 9px 12px;
		border-width: 1px;
		border-color: var(--color-rule);
	}

	ul {
		position: absolute;
		z-index: 60;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		margin: 0;
		padding: 4px;
		list-style: none;
		background: #fff;
		border: 1px solid var(--color-rule);
		border-radius: 6px;
		box-shadow: 0 12px 32px rgb(11 27 63 / 0.18);
		max-height: 300px;
		overflow: auto;
	}

	li button {
		display: block;
		width: 100%;
		text-align: left;
		font-size: var(--text-small);
		padding: 9px 12px;
		border: 0;
		border-radius: 4px;
		background: transparent;
		cursor: pointer;
		color: var(--color-ink);
	}

	li button.active {
		background: var(--color-paper-alt);
		color: var(--color-navy);
		font-weight: 600;
	}
</style>
