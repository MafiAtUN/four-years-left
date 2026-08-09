# Four Years Left
## The story for your UN briefing and the complete plan for an Atlas style github.io page

Prepared for: Mafi
Occasion: Briefing 1, Implementation and progress of the SDGs, 12:30 to 13:30, room GA1B33, UN Headquarters
Audience: 20 students and 4 group leaders from Emory, NYU and Columbia, focused on diplomacy, international policy and the SDGs
Data source: SDG Index database, Sustainable Development Report 2026 (Fuller, Iablonovski, Lafortune and Sachs), license CC BY NC ND 4.0
Delivery vehicle: a scrollytelling website in the style of the World Bank Atlas of Global Development, hosted on GitHub Pages, driven live from the podium
Timeline: the briefing is tomorrow. Part B therefore includes a one day build schedule with a strict must, should, could triage, and the production data files have already been generated for you (sdg-data-package.zip contains prepare_data.py plus all eight JSON files, verified against this document).

Every number in this document was computed directly from your uploaded database. The verified figures are collected in the appendix so the talk and the website never disagree.

---

# PART A. THE STORY

## The thesis in one sentence

In 2015 the world made 17 promises with a 2030 deadline. The world is still moving forward, and the last 25 years prove transformation is possible, but progress has slowed to nearly a standstill exactly when it needed to accelerate, and what happens in the four years left is a choice, one that this generation of students will inherit.

## Why this framing wins the room

These are students of diplomacy and international policy. They have heard both the utopian pitch and the doom pitch. The credible story, and the one your data actually tells, is the tension between two true things. First, humanity is measurably better off than in 2000 on almost every count. Second, the machine of progress is losing speed, and the goals about peace, institutions, food and climate are the ones failing. Holding both truths at once is what makes a briefing feel honest rather than promotional, and it hands you a natural discussion engine: why is this happening, and what would you do about it.

## The arc in nine scenes

Each scene below is one section of the website and one beat of the talk. For each I give the message, the number that carries it, and what is on screen.

### Scene 1. The promise
Message: In September 2015, 193 countries adopted 17 goals for 2030. This is the largest shared to do list in human history. Today we are 11 years in with 4 years to go.
On screen: the hero. Deep navy, a field of 169 glowing particles (one per ranked country), the title, and the reveal data toggle. When you flip the toggle, the particles snap into a beeswarm ordered by SDG Index score, and the room sees for the first time that the decoration was the world all along. Do this flip live. It is the single best theatrical moment in the Atlas grammar and it earns attention for the next 50 minutes.

### Scene 2. The long good news
Message: Before we judge the last decade, look at the last 25 years. Extreme poverty fell from 32 percent to 9 percent. Life expectancy rose from 67.6 to 73.7 years. Child deaths fell by more than half. Electricity reached 9 in 10 people.
The number: extreme poverty 32 percent down to 9 percent since 2000.
On screen: a you draw it chart, the Atlas gender story trick. Ask a student to guess the poverty line from 2000 to today by drawing on the screen (or have the room vote rising, flat, falling before you reveal). Then the real line animates in. Most audiences guess too pessimistically, which is your first insight: the world does not know its own progress.

### Scene 3. The stall
Message: Now the uncomfortable part. The pace of progress on the SDG Index has roughly halved. From 2015 to 2019 the world gained about 0.52 points per year. Since 2019 it is 0.31. From 2024 to 2025 the world index moved just 0.02 points, the slowest year on record. The pandemic, wars, debt distress and trade fragmentation form the polycrisis behind the flattening curve.
The number: 0.02 points of progress in the latest year.
On screen: the signature scrolly. One line, the World SDG Index 2000 to 2025, drawn in the Atlas manner where the line segment color encodes pace (blue when fast, yellow when slowing, red when near flat). Scroll steps annotate 2015 (adoption), 2020 (the COVID bend) and 2025 (the plateau).

### Scene 4. The report card
Message: The SDR dashboard rates every country on every goal. Across all 169 ranked countries and 17 goals, only 7 percent of ratings are green. 40 percent are red. And the direction of travel: about half of all country goal trends are stagnating and 7 percent are in reverse. Only 6 percent are fully on track.
The number: 7 percent green, 40 percent red.
On screen: a waffle of all country goal cells that sorts itself by color on scroll, exactly the emphasis by rearrangement move the Atlas uses. This is the emotional low point of the talk, placed deliberately at the center.

### Scene 5. Seventeen goals, three stories
Message: The average hides the plot. Innovation and infrastructure (SDG 9) jumped 18.4 points since 2015, the biggest win, driven by connectivity. Social goals moved moderately. But food (SDG 2) has gone slightly backwards, and peace and institutions (SDG 16) fell 3.3 points globally, declining in 152 of 205 countries. The goals we are failing are not technical goals. They are political ones.
The number: SDG 16 declined in 152 of 205 countries.
On screen: scrolly of 17 goal score lines 2015 to 2025, first all grey, then steps spotlight SDG 9 (the climber), then SDG 2 (the stall), then SDG 16 (the reversal) while everything else fades. Caption cards use color highlighted words as the legend, the Atlas signature.

### Scene 6. The geography of progress
Message: Where you are born still writes most of your scorecard. The OECD averages 78 on the index, Sub-Saharan Africa 54. But the more interesting line is convergence: Sub-Saharan Africa climbed 9 points since 2000, East and South Asia even faster. Poorer regions are mostly moving toward the frontier, not away from it.
The number: a 24 point gap between OECD and Sub-Saharan Africa.
On screen: regional index lines with direct labels on the curves, no legend box, then a step that highlights the closing distance.

### Scene 7. Three portraits
This is your requested spotlight section and the discussion fuel. Three short profiles, one scroll step each.

Portrait one, the United States. Rank 45 of 169, score 75.3, down from rank 40 in 2015. Red on seven goals including inequality (SDG 10, the only US goal trending down), responsible consumption, climate, and institutions. Green on exactly one: innovation. Say it plainly and let it land. The students are at three US universities. The question you leave hanging: why does the richest large economy rank 45th, and is that a data artifact or a policy verdict?

Portrait two, Bangladesh. Score up from 53.1 in 2000 to 64.8 today, rank climbed from 118 to 110 since 2015. A lower middle income country outperforming its income class through deliberate investment in health, education and disaster resilience. And one detail that flips the room's assumptions: Bangladesh is green on climate action (SDG 13) while the United States is red. Low emitters bear the floods, high emitters hold the emissions. One goal, two very different report cards, which is exactly what the SDG framework was designed to expose. If you have a personal connection to Bangladesh, this is the moment to use it. Firsthand texture is what a UN briefing offers that a lecture cannot.

Portrait three, movers in both directions. India climbed 18 rank places since 2015, the Philippines 21, Benin 18, the Gulf states more than 20. Lebanon fell 25 places, the sharpest collapse in the dataset, with Argentina and Zimbabwe also sliding. The lesson for future diplomats: national trajectories are not fate. Policy moves countries up. Crisis, conflict and institutional decay move them down, fast.

On screen: an arrow chart, each country a 2015 to 2025 rank arrow, grey field with the portrait country highlighted per step.

### Scene 8. Nobody has finished
Message: Finland ranks first at 87.4 and is still red on responsible consumption and climate, with a mediocre spillover score. Only 7 countries in the world score lower today than in 2015, so nearly everyone advances, yet not one country is on track for all 17 goals. The SDGs are not a race others must finish. They are unfinished business everywhere, including here.
The number: zero countries on track for all 17 goals.
On screen: Finland's 17 goal tiles, greens first, then the camera shifts to its reds. A quiet, effective ending to the data narrative.

### Scene 9. Four years, then the floor
Message: At the current pace the world index reaches about 70.5 by 2030, far from where the 2015 curve was pointing. Close with the choice framing: the difference between the current path and the promised one is not knowledge, money or technology. It is priorities, institutions and cooperation, the exact things your fields of study exist to fix. Then open the explorer and hand the room the data.
On screen: the projection cone to 2030, then the country explorer for Q&A.

## Run of show, 12:30 to 13:30

12:30 to 12:35. Welcome, who you are, what the UN system does with data like this. The hero is on screen, particles drifting.
12:35 to 12:38. Scene 1 and the reveal data flip.
12:38 to 13:05. Scenes 2 through 8, scrolling the story. Budget roughly 3 to 4 minutes per scene. The scroll is your slide clicker, and because scenes are viewport locked you can pause on any state indefinitely for tangents.
13:05 to 13:12. Scene 9 and the explorer. Invite two or three students to name a country, pull its dashboard live. International students will name home countries. This is reliably the moment a briefing becomes a conversation.
13:12 to 13:28. Discussion. Prompts below.
13:28 to 13:30. Close with the four years framing and where they can access the site and data themselves (the site stays online for them, which is the quiet advantage of delivering a briefing as a public website).

## Discussion prompts that fit this audience

Why is SDG 16 the most widespread decline, and what does that imply about the other 16 goals given that institutions deliver them all? Should a country like the US at rank 45 treat the index as a verdict or dispute the methodology, and who gets to define the metrics of development? Bangladesh is green on climate while the US is red: is the dashboard measuring responsibility or capacity, and which should it measure? If you ran the 2027 SDG Summit, would you renegotiate the goals, the deadline, or the financing? What does the aid contraction of the mid 2020s do to the poorest countries' trajectories?

## Anticipate these three student questions

Whose numbers are these? Answer honestly: this is the SDG Index from the Sustainable Development Report, an independent academic assessment led by SDSN, not official UN statistics. The official companion is the UN SDG progress report. Using an independent scorecard in a UN briefing is itself a talking point about accountability, and the reason your page will carry clear attribution.
Is the index fair to poor countries? The dashboard rates outcomes, so wealth correlates with score. The counterpoints are in your story: Bangladesh outperforming its income class, spillover scores penalizing rich country footprints, and climate ratings inverting the usual hierarchy.
Is 2030 realistic? At the measured pace, no, and pretending otherwise would lose this audience. The honest answer is that deadlines mobilize even when missed, and the 25 year record proves fast progress is achievable when priorities align.

---

# PART B. THE GITHUB.IO PAGE PLAN

## Concept

Name: Four Years Left: The State of the World's Promises
One long Atlas grammar scrollytelling story matching the nine scenes above, followed by a country explorer, followed by Atlas style endmatter (about, methodology, citation, license). One page, no routing beyond anchors. English only. Desktop first because it presents from a podium at 16:9, but responsive because students will open it on phones afterward.

## Tech stack, chosen to be perfect for GitHub Pages

SvelteKit with adapter-static, prerendered, so the site is pure static files served by GitHub Pages. Svelte 5. The scrollytelling uses svelte-scroller, the same component the World Bank Atlas itself uses. Charts are hand built Svelte components rendering SVG, with d3-scale, d3-shape, d3-array and d3-geo as math helpers only, no charting library. The hero particles use a single canvas 2D layer (450 particles at most, no WebGL needed, simpler and reliable on the briefing room machine). The world map, if used in the explorer header, is static SVG via d3-geo equal earth projection from world-atlas TopoJSON, deliberately not Mapbox: no tokens, no network dependency, works offline. Tailwind for layout. No runtime data fetching from external services: every number is baked into static JSON at build time from your xlsx.

Two practical notes that protect the briefing itself. First, GitHub Pages serves project sites from a subpath, so paths.base must be set to /REPO_NAME in svelte.config.js, the classic github.io pitfall. Second, build a full offline fallback: the site must run from localhost with zero external requests (fonts self hosted) in case UN guest wifi misbehaves. Rehearse from localhost, present from the live URL.

## Design system

Base: the Atlas dark navy #0B1B3F for hero and endmatter, white body, single centered reading column of about 65 characters.
Accent logic: the Atlas uses one accent per theme. Your equivalent is the official UN SDG goal palette (SDG 1 #E5243B, 2 #DDA63A, 3 #4C9F38, 4 #C5192D, 5 #FF3A21, 6 #26BDE2, 7 #FCC30B, 8 #A21942, 9 #FD6925, 10 #DD1367, 11 #FD9D24, 12 #BF8B2E, 13 #3F7E44, 14 #0A97D9, 15 #56C02B, 16 #00689D, 17 #19486A). Site level accent: UN blue #009EDB for structure, with the SDG colors reserved for goal encodings.
Dashboard scale (from the database legend): green #2EA043, yellow #F5C518, orange #F58220, red #D64545, grey #B0B7C3, adjusted as needed to pass 3 to 1 contrast on white.
Typography: a rounded display face for headlines and big numbers (Baloo 2 or Fredoka, self hosted) echoing the Atlas voice, Inter for body and captions.
Chart furniture, copied exactly from the Atlas: every chart gets a bold finding as its title, a plain subtitle naming the measure and units, a thin accent rule, a linked source line, and dotted gridlines with minimal ticks. Captions inside scrolly steps are white cards with a colored left bar, and key words in each caption are highlighted in the exact series color, replacing legends everywhere.
Texture: the country particles from the hero recur as section divider drift, and in Scene 4 they fly into the waffle grid, the Atlas particles become data move.
Accessibility: a reduced motion toggle in the header honoring prefers-reduced-motion, which swaps scrolly morphs for crossfades. Every scrolly state must read as a complete labeled chart on its own, because you will pause mid state while talking.

## The presentation layer, page by page for the room

The site must behave like a deck when you are at the podium and like an article when students revisit it later. Both come from the same structure.

Each of the nine scenes is a full viewport page. Between scenes the page scrolls normally, but a global keyboard handler turns the whole story into a linear sequence of stops: every scene boundary and every scrolly step registers itself as a stop in order, and the right arrow, space bar or page down key smooth scrolls to the next stop while the left arrow and page up go back. Because svelte-scroller states are a pure function of scroll position, driving the scroll drives the story, and the same page works untouched for a scrolling reader. Number keys 1 through 9 jump straight to a scene, the home key returns to the hero, F toggles fullscreen, and B fades the screen to the navy background for moments when you want eyes on you rather than the screen. A slim progress rail of nine dots sits on the right edge showing where you are, clickable as an escape hatch if you need to jump during Q&A.

Projection rules, because GA1B33 is a briefing room with a distant screen: base body text at least 20 px, caption cards 22 px, chart tick labels at least 16 px, nothing on screen ever below 14 px, headline numbers hundreds of pixels tall. One point per stop, cards never longer than two sentences, and every scrolly state must stand alone as a complete labeled chart because you will pause on states while talking. Test the whole run at 1920 by 1080.

Presenter safety: the entire site runs offline from localhost with self hosted fonts, so the UN guest wifi cannot hurt you. Rehearse from localhost, present from the live URL if the room network cooperates.

## The country comparison system

This answers how to put countries on the charts. One mechanism serves the whole site: a global comparison set holding up to three countries, chosen from a type ahead picker that lives in a floating Compare pill at the bottom right of the screen. Each chosen country occupies a fixed color slot (slot one violet #8E44AD, slot two teal #00A6A6, slot three magenta #D81B60, three hues chosen to clash with nothing in the SDG palette or the dashboard scale). A country keeps its slot color on every chart on the page, so the colors themselves become the legend, the same trick the Atlas plays with caption highlights. Removable chips under the pill show the active set, with one click quick add chips for the United States, Bangladesh, India, China, Nigeria and Brazil, the countries most likely to come up with this group.

Where the comparison set appears, automatically, wherever it is meaningful. On the stall chart of Scene 3, each comparison country's index line 2000 to 2025 overlays the world line, thin, direct labeled at the end point. On the regional chart of Scene 6, the same overlays sit against the regional averages, which is where Bangladesh against its income class becomes visible on demand. On the portraits arrow chart of Scene 7, comparison countries' rank arrows light up in their slot colors with labels. In the explorer, comparison countries render as side by side dashboard columns, seventeen tiles each, next to the selected country, plus overlaid index lines on the explorer's trend chart. The world map thumbnails and the waffle stay comparison free, where per country overlays would be noise.

The set is encoded in the URL hash, for example #compare=USA,BGD,IND, so you can bookmark prepared states: open the briefing with nothing, and when a student says Nigeria, type three letters, press enter, and every subsequent chart in the story carries Nigeria for the rest of the hour. That single moment, the room watching its own question propagate through the entire narrative, is the strongest interactive beat available to you tomorrow, and it costs one shared Svelte store.

## Audience calibration

Everything on screen assumes an intelligent reader who has never seen this dataset, which is exactly what 20 policy students are. The index is defined once, in scene 1, in one line: a 0 to 100 grade averaging a country's performance across all 17 goals. No acronym appears unexplained, SDSN is written out on first use, and the methodology caveats live in the endmatter rather than the story. The tone on the United States portrait stays interrogative rather than accusatory, the data raises questions and the room answers them, which respects both the venue and the mixed international audience. Bangladesh is framed as evidence that income does not dictate trajectory. One line lands the deadline personally: in 2030 most people in this room will be in the first years of their careers, which makes the last SDG mile their inheritance rather than an abstraction. And the three built in participation moments, the reveal data flip, the poverty guess, and the explorer with their countries, are spaced at the start, middle and end of the hour, which is deliberate pacing for a student audience after a morning of tours.

## Information architecture and section specs

Section 0, header. Minimal. Title left, reduced motion toggle and About link right.

Section 1, hero (Scene 1). Navy full viewport. Kicker UN BRIEFING, EMORY NYU COLUMBIA VISIT. Title Four Years Left. Standfirst of two sentences. Byline: your name and role, data credit to SDR 2026. The what is shown here, reveal data toggle morphs 169 particles into a beeswarm by index score with a 0 to 100 axis, Finland and South Sudan labeled at the extremes. Scroll cue at bottom.

Section 2, key facts strip. Four stat cards: 9.3 percent extreme poverty today, 0.02 index points gained last year, 7 percent of goal ratings green, 4 years to 2030.

Section 3, prose plus you draw it (Scene 2). Two paragraphs, then the interactive: draw the world extreme poverty rate from 2000 (32 percent) to 2026, release, the truth animates in, with a delta readout comparing the guess to reality. Fallback button reveal answer for a mouse shy room.

Section 4, scrolly one, the stall (Scene 3). Sticky chart, World SDG Index 2000 to 2025, y axis 55 to 75. Four steps: full line in pace coded segments, zoom band 2015 to 2019 with 0.52 per year annotation, 2019 to 2025 with 0.31, then the 2024 to 2025 flat segment highlighted with the 0.02 big number annotation in the corner, Atlas style.

Section 5, scrolly two, the report card (Scene 4). Sticky waffle of 2873 cells, one per country goal rating. Steps: random scatter of colored cells as the particles settle in, sort by color into bands with the 7 green 18 yellow 32 orange 40 red percent labels, then a trend overlay step showing on track 6 percent, stagnating 49 percent, reversing 7 percent as arrow glyphs.

Section 6, scrolly three, seventeen stories (Scene 5). Sticky line chart, 17 world goal scores 2015 to 2025, all grey at first. A small multiples state follows, the seventeen lines fanning out into a four by five grid of panels, each titled and colored by its SDG, the Atlas shrink into a grid move. Then the grid collapses back to one frame and steps spotlight SDG 9 (+18.4, orange #FD6925), SDG 2 (minus 0.5, mustard #DDA63A), SDG 16 (minus 3.3 and the 152 of 205 countries stat, blue #00689D), each with color matched caption highlights. If the fan out transition threatens the schedule, ship the grid as a static state and keep the spotlights.

Section 7, scrolly four, the world and its regions (Scene 6). Sticky background with two forms. Step one, the choropleth: equal earth SVG world map built with d3 geo, countries filled by 2026 index score in a five step blue ramp, grey for unranked, Finland and South Sudan labeled, legend bar beneath. Step two, the map crossfades into regional index lines 2000 to 2025 with direct end labels: OECD 78.2, Eastern Europe and Central Asia, Latin America and Caribbean, East and South Asia, MENA, Sub-Saharan Africa 53.7, World dashed. Step three, gap annotation. Step four, convergence step highlighting Sub-Saharan Africa and East and South Asia slopes. Comparison set countries overlay as thin slot colored lines.

Section 8, scrolly five, three portraits (Scene 7). Sticky arrow chart of 2015 to 2025 rank changes for all 169 countries, thin grey arrows. Step one highlights the United States arrow 40 to 45 with a side card of its 17 goal tiles (one green, seven reds). Step two highlights Bangladesh 118 to 110, side card showing green on SDG 13, and the caption makes the US Bangladesh climate contrast explicit. Step three highlights climbers India, Philippines, Benin, UAE in green and fallers Lebanon, Argentina, Zimbabwe in red with direct labels.

Section 9, nobody has finished (Scene 8). Static composition, no scrolly: Finland's 17 tiles large, reds emphasized, with the zero countries on track for all 17 goals line as a pull quote panel.

Section 10, projection close (Scene 9). Simple cone chart: index history plus 2030 extrapolation at current pace reaching about 70.5, against the faded pre 2019 trajectory. One line of text, the choice framing. Then a visual handoff into the explorer.

Section 11, the explorer. Header: searchable country select (type ahead over 169 ranked countries plus regional aggregates). Body: the selected country's score and rank as big numbers, its index line 2000 to 2025 against its regional average, and a 17 tile goal dashboard grid, each tile in its SDG color band with the dashboard rating as background and the trend arrow glyph, tooltips naming the goal. Preload the United States, Bangladesh, India, Lebanon and Finland as one click chips since they star in the story. Countries in the comparison set render as additional dashboard columns beside the selected country and as overlaid lines on its trend chart, so a question from the room becomes a side by side answer in seconds. This section is your Q&A instrument.

Section 12, endmatter. About this briefing, methodology note (what the SDG Index is and is not, the independence point), suggested citation, CC BY NC ND 4.0 license notice with attribution to Fuller, Iablonovski, Lafortune and Sachs, SDSN, your contact, and a link to download the underlying JSON. The license is non derivative, so frame the site as visualization and commentary on the published database with full credit prominently displayed.

## Data pipeline

One Python script, scripts/prepare_data.py, reads the xlsx and writes static JSON to static/data/. Run it once, commit the JSON, the site never touches Excel. Outputs:

world_index.json, the World row of the backdated index by year.
goal_scores_world.json, world goal1 through goal17 by year, 2015 to 2025.
regions.json, the six regional aggregates plus World by year.
dashboard_cells.json, for the waffle: array of country, goal, rating, trend.
ranks.json, country, rank2015, rank2025, region.
countries.json, keyed by country: score, rank, region, 17 ratings, 17 trends, index by year, for the explorer (about 300 kB, fine).
poverty_world.json, sdg1_wpc World series for the you draw it.
key_facts.json, the headline stats so prose and charts share one source of truth.

The script also emits derived_stats.json (paces, percentages, deltas) so no number is ever hand typed into the page. That is your consistency guarantee.

## Repository and deployment

Repo name suggestion: four-years-left (the URL becomes username.github.io/four-years-left). Structure: scripts/prepare_data.py, static/data/, static/fonts/, src/lib/components/ (Scroller wrapper, LineChart, Waffle, ArrowChart, Beeswarm, GoalTiles, StatCard, CaptionCard, DrawIt, Particles), src/lib/stores (reduced motion, scroll state), src/routes/+page.svelte composing sections in order. Deployment via the standard GitHub Actions workflow for SvelteKit static: build on push to main, publish to Pages. Set paths.base from the repo name, trailingSlash always, prerender true. Add a print stylesheet as a bonus so the page prints to a clean handout PDF.

## Atlas fidelity audit

A technique by technique check of this plan against the observed Atlas grammar, so nothing is lost in translation.

| Atlas technique | Status in this plan |
|---|---|
| Scrollytelling via svelte-scroller, sticky chart, viewport tall scenes | Carried over exactly, same component |
| Caption cards with colored accent bar, one point per step | Carried over exactly |
| Color highlighted words in captions acting as the legend | Carried over exactly, mandatory on every scrolly |
| Chart titles that state findings, subtitle with units, accent rule, linked source line | Carried over exactly as chart furniture rules |
| Emphasis by fading everything else | Carried over in the seventeen goals and portraits scrollies |
| Direct labels on curves, no legend boxes | Carried over on every line chart |
| Value band coloring of a line by its meaning | Carried over on the stall chart, pace coded segments |
| Hero particle field that is secretly the data, reveal data toggle | Carried over, canvas 2D instead of WebGL, a deliberate simplification safe for 450 dots on a podium machine |
| Particles flying into charts | Could have tier only, honest cut for the deadline |
| Key facts strip, big number callouts, pull quote panels | Carried over exactly |
| You draw it interactive | Downgraded to a guess vote for tomorrow, full version in the could have tier |
| Choropleth world maps | Now included, see the map addition below, as static SVG equal earth rather than Mapbox, deliberately, for offline safety and zero tokens |
| Small multiples grid | Now included as a state in the seventeen goals scrolly, see below |
| Per chart export buttons, table, image, link | Now included in the should have tier, see below |
| Endmatter with references, citation, credits, license | Carried over exactly |
| Reduced motion toggle, footnoted methodology | Carried over |

Three additions closing the real gaps found by this audit.

The map. The Atlas is unimaginable without a world map and students respond to maps more than to any other form. Scene 6 therefore opens with a choropleth: an equal earth SVG world map built with d3 geo from world atlas TopoJSON, countries filled by 2026 SDG Index score in a five step UN blue ramp, grey for unranked, with Finland and South Sudan called out. Two scroll steps, the map first, then a step where the map crossfades into the regional lines chart already specified, which is precisely the Atlas move of map into chart. It costs roughly an hour, sits in the must have tier, needs no tiles, no tokens and no network, and gives the explorer its visual anchor as a mini map beside the country header.

Small multiples. The seventeen goals scrolly gains one state: before the spotlight steps, the seventeen lines fan out into a four by five grid of small multiples, each panel titled and colored by its SDG, exactly the shrink into a grid transition observed in the Global Progress story. If the fan out animation resists the schedule, a static grid state is acceptable, the transition is the could have, the grid itself is not.

Export affordances. Each chart footer gains the three small Atlas buttons: view as table, download as PNG, copy link to section. Table and copy link are trivial. PNG export uses SVG serialization to canvas. Should have tier, and if the day runs long, view as table ships alone since it doubles as the accessibility story for every chart.

## The one day build, hour by hour

The event is tomorrow, so the seven milestone plan collapses into a single day with a strict triage. The data step is already done: sdg-data-package.zip contains prepare_data.py and all eight verified JSON files. Unzip data/ into static/data/ and you begin at hour two.

Must have, non negotiable for the podium: the shell deployed on Pages with correct base path, hero with the beeswarm and reveal toggle (a crossfade between the drifting and sorted states is acceptable, the full particle morph is not required), the key facts strip, the stall scrolly, the report card waffle, the seventeen goals scrolly with at least a static small multiples state, the choropleth world map opening the world and regions scrolly, the portraits arrow chart, the Finland and projection sections as static compositions, the explorer with search and goal tiles, the keyboard presentation layer with progress rail, the comparison system on the stall chart, arrow chart and explorer, and the endmatter with license and citation.

Should have, add if on schedule: the poverty moment as a three button vote (rising, flat, falling) which is thirty minutes of work instead of the three hours the full draw interaction costs, comparison overlays on the regions chart, the view as table export button on every chart, and the print stylesheet.

Could have, only if the evening is calm: the true you draw it interaction, the particles flying into the waffle, animated stat count ups, a closing QR code slide pointing at the live URL.

The schedule, assuming roughly ten working hours. Hour one, scaffold SvelteKit static plus Tailwind plus tokens plus fonts, deploy the empty shell to Pages immediately so deployment risk dies first. Hour two, drop in the JSON, build StatCard and the key facts strip to prove the data pipe. Hours three and four, the Scroller wrapper, CaptionCard and the stall scrolly end to end including reduced motion fallback, this sets the pattern everything copies. Hour five, the waffle. Hour six, the seventeen goals scrolly with its small multiples state. Hour seven, the choropleth map and regions scrolly. Hour eight, portraits plus Finland plus projection, then the explorer, these are the fastest builds of the day because portraits reuses the line and arrow patterns and the explorer is mostly layout over countries.json. Hour nine, the comparison store, picker pill and overlays. Hour ten, the keyboard layer, progress rail, endmatter, then the full offline rehearsal with a timer. If any hour overruns, take the cut from the could have list, never from rehearsal.

Working with Claude Code tomorrow: open the session by handing it this whole document and the data package, then request the hours in order, reviewing in the browser after each. Two prompts that save time when scrollies act up: ask for a click through fallback where the caption card carries next and back buttons driving the same state index, which converts any broken scrolly into a serviceable slide in minutes, and ask for a states debug page that renders every scrolly state statically side by side so you can eyeball all chart states at once without scrolling.

## Perfection checklist before the briefing

Fact check: every on screen number matches derived_stats.json, which matches the appendix below. Rehearse the full scroll twice with a timer, marking where 13:05 must find you. Test on the room setup: GA1B33 has PowerPoint style projection, so verify at 1920 by 1080 and have the localhost fallback on your laptop. Type Bangladesh, Nigeria, China, Brazil and Mexico into the explorer beforehand so live requests hold no surprises. Load the site on a phone for the QR moment if you choose to share it at the close. Confirm attribution wording against the SDR 2026 citation requirement.

---

# APPENDIX. VERIFIED NUMBERS (computed from your file)

| Fact | Value |
|---|---|
| Ranked countries in 2026 index | 169 (208 entities including regions and World) |
| World SDG Index 2000, 2015, 2025 | 59.0, 65.0, 68.96 |
| Annual pace 2015 to 2019 | +0.52 points per year |
| Annual pace 2019 to 2025 | +0.31 points per year |
| Gain 2024 to 2025 | +0.02 points |
| Dashboard ratings, all countries and goals | green 7 percent, yellow 18, orange 32, red 40, grey 4 |
| Trend arrows | on track 6 percent, moderately improving 37, stagnating 49, decreasing 7 |
| Goal deltas 2015 to 2025, world | SDG 9 +18.4, SDG 1 +7.7, SDG 10 +7.0, SDG 5 +6.1, SDG 2 minus 0.5, SDG 13 flat, SDG 16 minus 3.3 |
| SDG 16 decliners | 152 of 205 entities |
| Countries below their 2015 index today | 7 (including Lebanon, Sudan, Zimbabwe, Austria) |
| Regional index 2025 | OECD 78.2, Sub-Saharan Africa 53.7 (from 44.4 in 2000) |
| Finland | rank 1, score 87.4, red on SDG 12 and 13, spillover 66.9 |
| South Sudan | last, score 39.9 |
| United States | rank 45 (was 40 in 2015), score 75.3, red on SDGs 2, 10, 12, 13, 15, 16, 17, green only SDG 9, SDG 10 declining |
| Bangladesh | score 53.1 in 2000 to 64.8 now, rank 118 to 110 since 2015, green on SDG 13 |
| Rank climbers 2015 to 2025 | UAE +22, Saudi Arabia +22, Oman +21, Philippines +21, India +18, Benin +18, Montenegro +18, Togo +17 |
| Rank fallers | Lebanon minus 25, Algeria minus 18, Zimbabwe minus 18, Argentina minus 13, Costa Rica minus 13 |
| Extreme poverty, world | 32.0 percent in 2000 to 9.3 percent in 2026 |
| Life expectancy, world | 67.6 years in 2000 to 73.7 in 2025 |
| Under 5 mortality | 57.0 to 24.6 per 1000, 2000 to 2024 |
| Electricity access | 77.9 to 91.7 percent, 2000 to 2023 |
| Maternal mortality | 217 to 113 per 100000, 2000 to 2023 |
| 2030 projection at current pace | about 70.5 |

Sources inside the database: Overview, Codebook, SDR2026 Data, All Raw Data, Backdated SDG Index, Backdated Ranks over time sheets of the SDG Index database for the Sustainable Development Report 2026.
