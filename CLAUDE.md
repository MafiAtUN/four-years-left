# Four Years Left, SDG briefing site for Io Sono Futuro

Scrollytelling presentation site in the World Bank Atlas of Global Development style,
built for Io Sono Futuro – I Am The Future, the national programme of Fondazione Della Frera ETS
that identifies and supports young Italian talent through education, innovation and international
experiences (earlier editions went to Expo Dubai, Cybertech New York and Expo Osaka). The 2026
edition's theme is the use of Artificial Intelligence to address emerging global challenges, and
the New York mission is its final stage. Briefing topic: Artificial Intelligence, the Sustainable
Development Goals and the UN 2030 Agenda.

The audience is Italian high school and university students selected for AI based project
ideas, with their educators and Fondazione representatives. They want to see how their ideas
can contribute to the SDGs and hear priorities, challenges and opportunities from a UN expert.
Copy is in English; keep it plain for non native speakers. Tie the framing to their projects
and to AI where it is honest to do so, never by inventing AI statistics: every number still
comes from derived_stats.json.

Host branding: there is no logo. The programme's name is set in type with a UN blue bar,
and every mention reads from HOST in src/lib/host.js. It appears in the header, the hero, the
endmatter and both quiz screens; keep it there when editing those files. No outbound link to
the host until an official URL is confirmed. static/favicon.png is a navy "4" tile.

The opening runs quiz (/quiz/results), then the speaker (/speaker), then the briefing: Next on
the quiz score goes to /speaker, and forward from /speaker goes to the hero. The speaker's
facts live in src/lib/speaker.js, taken from the bio Mafizul supplied for the PGA81 staff directory;
static/qr-linkedin.svg must encode SPEAKER.linkedin exactly.

The home country is Italy (HOME in src/lib/tokens.js), drawn as a fixed reference on the
Stall, Portraits and world map charts and first among the explorer chips.

## The spec

PLAN.md is the complete specification. Read it fully before writing code.
Part B defines every section, the design system, the presentation layer,
the comparison system, and the hour by hour schedule. Follow it exactly.

## Stack and conventions

- SvelteKit (Svelte 5) + adapter-static, fully prerendered. Tailwind for layout.
- Scrollytelling: @sveltejs/svelte-scroller. One Scroller wrapper component, reused everywhere.
- Charts: hand built Svelte components rendering SVG. d3-scale, d3-shape, d3-array, d3-geo
  as math helpers only. No charting library. No Mapbox.
- Base path: paths.base = process.env.BASE_PATH ?? '/four-years-left' (GitHub Pages project site).
- ZERO external network requests at runtime. Fonts self hosted in static/fonts
  (Baloo 2 for display, Inter for body). Site must work fully offline from localhost,
  which matters on untested venue wifi. Links out are fine; loading from them is not.
- All data comes from static/data/*.json (already generated, do not modify).
  Never hard code a statistic: prose numbers come from derived_stats.json.
- static/countries-110m.json is the world TopoJSON, static/name_map.json maps SDR
  country names to TopoJSON names. Nine microstates have no polygon at 110m scale,
  render them as small circles at their approximate location or omit from the map only.
- Colors, type scale and chart furniture rules are in PLAN.md Design system.
  Every chart: finding as title, units in subtitle, accent rule, linked source line.
  Caption cards: white, colored left bar, max two sentences, key words highlighted
  in the exact series color they reference. No legend boxes anywhere, direct labels only.
- Reduced motion: honor prefers-reduced-motion plus a manual toggle. Fallback is
  crossfade between states, never removal of content.
- Keyboard presentation layer per PLAN.md: arrows and space advance through ordered
  stops, digits 1 to 9 jump scenes, F fullscreen, B blanks to navy, progress rail right edge.
- Comparison store: max 3 countries, fixed slot colors #8E44AD #00A6A6 #D81B60,
  encoded in URL hash as #compare=ISO3,ISO3, overlays per PLAN.md.

## Commands

- npm run dev, then check in browser
- npm run build && npm run preview must pass with zero console errors before any milestone is done
- Deploy: push to main, .github/workflows/deploy.yml publishes to Pages

## Definition of done per section

Renders correctly at 1920x1080 and at 390px width, no console errors, every scrolly
state is a complete labeled chart when frozen, text sizes respect the projection
minimums in PLAN.md (body 20px, captions 22px, ticks 16px), and numbers match
derived_stats.json exactly.
