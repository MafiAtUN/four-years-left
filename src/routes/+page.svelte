<script>
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Presentation from '$lib/components/Presentation.svelte';
	import ComparePill from '$lib/components/ComparePill.svelte';

	import Hero from '$lib/sections/Hero.svelte';
	import KeyFacts from '$lib/sections/KeyFacts.svelte';
	import PovertyVote from '$lib/sections/PovertyVote.svelte';
	import Stall from '$lib/sections/Stall.svelte';
	import Waffle from '$lib/sections/Waffle.svelte';
	import Goals17 from '$lib/sections/Goals17.svelte';
	import WorldRegions from '$lib/sections/WorldRegions.svelte';
	import Portraits from '$lib/sections/Portraits.svelte';
	import Finland from '$lib/sections/Finland.svelte';
	import Projection from '$lib/sections/Projection.svelte';
	import Explorer from '$lib/sections/Explorer.svelte';
	import Endmatter from '$lib/sections/Endmatter.svelte';

	import { compare } from '$lib/stores/compare.svelte.js';

	// A bookmarked #compare=USA,BGD,IND restores before the first paint of any chart.
	onMount(() => compare.initFromHash());
</script>

<Header />
<Presentation />

<main>
	<!-- Scene 1, the promise -->
	<Hero />
	<KeyFacts />

	<!-- Scene 2, the long good news -->
	<PovertyVote />

	<!-- Scene 3, the stall -->
	<Stall />

	<!-- Scene 4, the report card -->
	<Waffle />

	<!-- Scene 5, seventeen goals, three stories -->
	<Goals17 />

	<!-- Scene 6, the geography of progress -->
	<WorldRegions />

	<!-- Scene 7, three portraits -->
	<Portraits />

	<!-- Scene 8, nobody has finished -->
	<Finland />

	<!-- Scene 9, four years, then the floor -->
	<Projection />
	<Explorer />
	<Endmatter />
</main>

<ComparePill />
