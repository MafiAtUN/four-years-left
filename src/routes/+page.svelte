<script>
	import { base } from '$app/paths';
	import { SDG, DASH, SLOT_COLORS } from '$lib/tokens';

	// Placeholder scaffold check. Replaced section by section from step 2 on.
	const sections = [
		'1 · Hero, 169 particles and the reveal data toggle',
		'2 · Key facts strip',
		'3 · The long good news, poverty vote',
		'4 · The stall, pace coded world index',
		'5 · The report card, 2873 cell waffle',
		'6 · Seventeen goals, small multiples and spotlights',
		'7 · The world and its regions, choropleth',
		'8 · Three portraits, rank arrows',
		'9 · Nobody has finished, Finland',
		'10 · Four years, the projection cone',
		'11 · The explorer',
		'12 · Endmatter, citation and license'
	];
</script>

<main class="min-h-screen bg-navy text-white">
	<div class="mx-auto max-w-5xl px-6 py-20">
		<p
			class="font-body text-[color:var(--color-un-blue)] uppercase"
			style="font-size:var(--text-small); letter-spacing:0.14em; font-weight:600;"
		>
			UN Briefing · Emory, NYU, Columbia visit
		</p>

		<h1 class="mt-6" style="font-size:var(--text-hero); line-height:0.95;">Four Years Left</h1>

		<p class="mt-6 max-w-[52ch] text-white/80" style="font-size:var(--text-lede);">
			The state of the world's promises. Scaffold deployed. Fonts self hosted, design tokens live,
			base path resolving, data files in place.
		</p>

		<!-- Token smoke test: if these render in the right colors and faces,
		     the design system is wired end to end. -->
		<div class="mt-14 grid gap-10 sm:grid-cols-2">
			<div>
				<h2 class="text-white/60" style="font-size:var(--text-small); font-weight:600;">
					SDG palette
				</h2>
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#each SDG.slice(1) as color, i}
						<span
							class="grid h-11 w-11 place-items-center rounded-md text-white"
							style="background:{color}; font-size:var(--text-micro); font-weight:700;"
							title="SDG {i + 1}">{i + 1}</span
						>
					{/each}
				</div>
			</div>

			<div>
				<h2 class="text-white/60" style="font-size:var(--text-small); font-weight:600;">
					Dashboard scale and comparison slots
				</h2>
				<div class="mt-3 flex flex-wrap gap-1.5">
					{#each Object.entries(DASH) as [code, color]}
						<span class="h-11 w-11 rounded-md" style="background:{color}" title={code}></span>
					{/each}
					<span class="w-4"></span>
					{#each SLOT_COLORS as color, i}
						<span
							class="h-11 w-11 rounded-full"
							style="background:{color}"
							title="Comparison slot {i + 1}"
						></span>
					{/each}
				</div>
			</div>
		</div>

		<div class="mt-14">
			<h2 class="text-white/60" style="font-size:var(--text-small); font-weight:600;">
				Sections to build, in order
			</h2>
			<ol class="mt-3 grid gap-x-10 gap-y-1 text-white/70 sm:grid-cols-2" style="font-size:17px;">
				{#each sections as s}
					<li>{s}</li>
				{/each}
			</ol>
		</div>

		<p class="mt-16 text-white/50" style="font-size:var(--text-micro);">
			Data: Sustainable Development Report 2026, SDG Index database (Fuller, Iablonovski, Lafortune
			and Sachs). CC BY-NC-ND 4.0. Base path: <code class="tabular">{base || '(root)'}</code>
		</p>
	</div>
</main>
