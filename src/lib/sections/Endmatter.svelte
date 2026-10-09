<script>
	import { base } from '$app/paths';
	import Section from '$lib/components/Section.svelte';
	import { stats } from '$lib/data';
	import { HOST } from '$lib/host.js';

	const FILES = [
		['world_index.json', 'World SDG Index by year, 2000 to 2025'],
		['goal_scores_world.json', 'World score for each of the 17 goals, 2015 to 2025'],
		['regions.json', 'Regional and income group averages by year'],
		['dashboard_cells.json', 'All 2,873 country by goal ratings and trends'],
		['ranks.json', 'Rank in 2015 and 2025 for every ranked country'],
		['countries.json', 'Per country score, rank, ratings, trends and index history'],
		['poverty_world.json', 'World extreme poverty rate, 2000 to 2026'],
		['derived_stats.json', 'Every headline figure used on this page']
	];
</script>

<Section scene={9} id="about" label="About and credits" dark>
	<div class="wrap">
		<div class="cols">
			<div>
				<h2>About this briefing</h2>
				<p>
					This page was built for <strong class="host-name">{HOST.programme} – {HOST.english}</strong>,
					the national programme of {HOST.org} that identifies and supports young Italian talent
					through education, innovation and international experience. Its {HOST.occasion} mission
					brings high school and university students whose AI based project ideas take on emerging
					global challenges. This is a briefing on the implementation and progress of the
					Sustainable Development Goals — the agenda those projects set out to serve. It is a
					visualization of, and commentary on, a published database. It is not a UN publication.
				</p>

				<h3>What the SDG Index is, and is not</h3>
				<p>
					The SDG Index is an independent academic assessment produced for the Sustainable
					Development Report by the Sustainable Development Solutions Network (SDSN), not official
					United Nations statistics. The official companion is the UN's annual SDG progress report.
					The index scores each country from 0 to 100 as an average of its performance across all 17
					goals, so it rates outcomes, and national wealth correlates with the result. Three things
					in this story push against that: Bangladesh outperforming its income class, spillover
					scores that penalise rich country consumption, and climate ratings that invert the usual
					hierarchy.
				</p>
				<p>
					Scores are backdated by the report's authors, so the {stats.world_2000} figure for 2000 is
					computed on today's methodology rather than taken from a report published in 2000. Ranks
					cover {stats.ranked_countries} countries with sufficient data.
				</p>
			</div>

			<div>
				<h3>Suggested citation</h3>
				<p class="cite">
					Fuller, G., Iablonovski, G., Lafortune, G. and Sachs, J. (2026). <em
						>Sustainable Development Report 2026</em
					>. Dublin: Dublin University Press. SDG Index database.
				</p>

				<h3>License and attribution</h3>
				<p>
					The underlying SDG Index database is published by Fuller, Iablonovski, Lafortune and
					Sachs (SDSN) under
					<strong>Creative Commons BY-NC-ND 4.0</strong>. That licence permits sharing with
					attribution for non commercial use and does not permit distribution of modified versions
					of the database. This page therefore presents the published figures as visualization and
					commentary, with attribution displayed on every chart, and links to the unmodified data
					below.
				</p>

				<h3>The data</h3>
				<ul class="files">
					{#each FILES as [file, what]}
						<li>
							<a href="{base}/data/{file}" download>{file}</a>
							<span>{what}</span>
						</li>
					{/each}
				</ul>

				<h3>Presenting this page</h3>
				<p class="keys">
					Arrow keys, space or page down move through the story one stop at a time. Digits 1 to 9
					jump to a scene, <strong>F</strong> is fullscreen, <strong>B</strong> blanks the screen,
					<strong>Home</strong> returns to the top and <strong>?</strong> lists the shortcuts. The
					comparison set is stored in the address, so a prepared set of countries can be bookmarked.
				</p>
			</div>
		</div>

		<div class="colophon">
			<div class="host-mark">
				<strong>{HOST.programme}</strong>
				<span class="host-tag">{HOST.english} · {HOST.org}</span>
			</div>
			<p>
				Built by Mafizul Islam for {HOST.programme}, {HOST.occasion}. Charts hand built in SvelteKit with d3 as a maths helper;
				no chart library, no map tiles, no external requests at all, so the page runs offline. Type
				is Baloo 2 and Inter, self hosted. Design grammar follows the World Bank's Atlas of Global
				Development.
			</p>
		</div>
	</div>
</Section>

<style>
	.wrap {
		max-width: 1400px;
		margin: 0 auto;
		padding: clamp(64px, 10vh, 120px) clamp(24px, 5vw, 64px);
	}

	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(32px, 5vw, 80px);
	}

	h2 {
		font-size: clamp(36px, 4vw, 58px);
		margin: 0 0 20px;
		color: #fff;
	}

	h3 {
		font-size: var(--text-h3);
		margin: 32px 0 10px;
		color: #fff;
	}

	h3:first-child {
		margin-top: 0;
	}

	p {
		font-size: var(--text-body);
		line-height: 1.6;
		color: rgb(255 255 255 / 0.82);
		margin: 0 0 14px;
		max-width: 62ch;
	}

	.cite {
		border-left: 4px solid var(--color-un-blue);
		padding-left: 16px;
	}

	.files {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.files li {
		display: flex;
		gap: 12px;
		align-items: baseline;
		padding: 7px 0;
		border-bottom: 1px solid rgb(255 255 255 / 0.14);
		font-size: var(--text-micro);
	}

	.files a {
		color: var(--color-un-blue);
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
	}

	.files a:hover {
		text-decoration: underline;
	}

	.files span {
		color: rgb(255 255 255 / 0.66);
	}

	.host-name {
		color: #fff;
	}

	/* The programme signs off the page: its name on the left, colophon beside it. */
	.colophon {
		display: flex;
		align-items: flex-start;
		gap: clamp(20px, 3vw, 44px);
		margin: 56px 0 0;
		padding-top: 24px;
		border-top: 1px solid rgb(255 255 255 / 0.18);
	}

	.colophon p {
		font-size: var(--text-micro);
		color: rgb(255 255 255 / 0.58);
		max-width: 100ch;
		margin: 0;
	}

	.host-mark {
		flex: 0 0 auto;
		border-left: 4px solid var(--color-un-blue);
		padding-left: 14px;
		color: #fff;
	}

	.host-mark strong {
		display: block;
		font-family: var(--font-display);
		font-size: var(--text-body);
		letter-spacing: 0.02em;
	}

	.host-tag {
		font-size: var(--text-micro);
		color: rgb(255 255 255 / 0.55);
	}

	@media (max-width: 700px) {
		.colophon {
			flex-direction: column;
			gap: 20px;
		}
	}

	@media (max-width: 1000px) {
		.cols {
			grid-template-columns: 1fr;
		}
	}
</style>
