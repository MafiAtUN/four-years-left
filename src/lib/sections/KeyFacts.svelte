<script>
	import Section from '$lib/components/Section.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import { stats, YEARS_LEFT, fmt1, fmt2, fmtPct } from '$lib/data';
	import { SOURCE_LINE } from '$lib/tokens';

	// Every value is read from derived_stats.json. Nothing here is typed by hand,
	// which is the consistency guarantee between the talk and the screen.
	const facts = [
		{
			value: fmt1(stats.poverty_latest),
			unit: '%',
			label: 'of the world lives in extreme poverty',
			note: `Down from ${fmt1(stats.poverty_2000)}% in 2000`,
			accent: 'var(--color-sdg-1)'
		},
		{
			value: fmt2(stats.gain_last_year),
			unit: '',
			label: 'index points gained in the latest year',
			note: 'The slowest year on record',
			accent: 'var(--color-dash-red)'
		},
		{
			value: fmtPct(stats.pct_dash.green).replace('%', ''),
			unit: '%',
			label: 'of all goal ratings are green',
			note: `${fmtPct(stats.pct_dash.red)} are red`,
			accent: 'var(--color-dash-green)'
		},
		{
			value: String(YEARS_LEFT),
			unit: '',
			label: 'years left to the 2030 deadline',
			note: '193 countries, 17 goals, one date',
			accent: 'var(--color-un-blue)'
		}
	];
</script>

<Section scene={1} id="facts" label="Key facts">
	<div class="wrap">
		<div class="grid">
			{#each facts as f}
				<StatCard {...f} />
			{/each}
		</div>
		<p class="src">Source: {SOURCE_LINE}</p>
	</div>
</Section>

<style>
	.wrap {
		max-width: 1400px;
		margin: 0 auto;
		padding: clamp(56px, 8vh, 104px) clamp(24px, 5vw, 64px);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: clamp(24px, 3vw, 56px);
	}

	.src {
		font-size: var(--text-micro);
		color: var(--color-ink-muted);
		margin-top: 48px;
		border-top: 1px solid var(--color-rule);
		padding-top: 14px;
	}

	@media (max-width: 1000px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 40px 32px;
		}
	}

	@media (max-width: 560px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
