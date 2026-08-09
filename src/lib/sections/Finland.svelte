<script>
	import Section from '$lib/components/Section.svelte';
	import GoalTiles from '$lib/components/GoalTiles.svelte';
	import { countries, fmt1 } from '$lib/data';
	import { DASH, GOAL_NAMES, SOURCE_LINE, textSafe } from '$lib/tokens';

	const fin = countries['Finland'];
	const reds = fin.dash
		.map((d, i) => ({ d, n: i + 1 }))
		.filter((t) => t.d === 'r' || t.d === 'o');
	const redNames = fin.dash
		.map((d, i) => ({ d, n: i + 1 }))
		.filter((t) => t.d === 'r')
		.map((t) => `SDG ${t.n} ${GOAL_NAMES[t.n]}`);
</script>

<Section scene={8} id="finland" label="Nobody has finished">
	<div class="wrap">
		<div class="left">
			<p class="eyebrow">Scene eight</p>
			<h2>Nobody has finished.</h2>
			<p class="lede">
				Finland ranks first in the world at {fmt1(fin.score)} out of 100, and it is still
				<strong style="color:{textSafe(DASH.r)}">red</strong> on
				{redNames.length === 1 ? 'one goal' : `${redNames.length} goals`}. Its spillover score, which
				measures the damage a country's consumption does abroad, is {fmt1(fin.spill)}.
			</p>

			<blockquote>
				<p class="quote">Not one country is on track for all 17 goals.</p>
				<p class="quote-sub">
					The SDGs are not a race others must finish. They are unfinished business everywhere,
					including here.
				</p>
			</blockquote>
		</div>

		<div class="right">
			<p class="tiles-head">Finland's 17 goals</p>
			<p class="tiles-sub">
				Tile color is the rating, the top band is the goal's official color, the arrow is the trend.
			</p>
			<GoalTiles rec={fin} cols={6} size={104} />
			<p class="reds">
				Still short on: {redNames.join(', ') || 'no goals rated red'}.
			</p>
			<p class="src">Source: {SOURCE_LINE}</p>
		</div>
	</div>
</Section>

<style>
	.wrap {
		max-width: 1500px;
		margin: 0 auto;
		padding: clamp(64px, 10vh, 128px) clamp(24px, 5vw, 64px);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(32px, 5vw, 80px);
		align-items: center;
		min-height: 100vh;
	}

	.eyebrow {
		font-size: var(--text-micro);
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-link);
		margin: 0 0 12px;
	}

	h2 {
		font-size: clamp(44px, 5vw, 76px);
		margin: 0 0 20px;
	}

	.lede {
		font-size: var(--text-lede);
		line-height: 1.5;
		max-width: 46ch;
		margin: 0;
	}

	blockquote {
		margin: 40px 0 0;
		border-left: 6px solid var(--color-un-blue);
		padding-left: 24px;
	}

	.quote {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: clamp(30px, 3vw, 46px);
		line-height: 1.1;
		margin: 0;
	}

	.quote-sub {
		font-size: var(--text-body);
		color: var(--color-ink-muted);
		margin: 14px 0 0;
		max-width: 44ch;
	}

	.tiles-head {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: var(--text-h3);
		margin: 0;
	}

	.tiles-sub {
		font-size: var(--text-small);
		color: var(--color-ink-muted);
		margin: 6px 0 18px;
		max-width: 52ch;
	}

	.reds {
		font-size: var(--text-body);
		margin: 22px 0 0;
		max-width: 52ch;
	}

	.src {
		font-size: var(--text-micro);
		color: var(--color-ink-muted);
		margin: 16px 0 0;
	}

	@media (max-width: 1100px) {
		.wrap {
			grid-template-columns: 1fr;
		}
	}
</style>
