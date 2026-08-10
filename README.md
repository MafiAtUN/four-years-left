# Four Years Left

A scrollytelling briefing on the UN Sustainable Development Goals, built in the style of the
World Bank *Atlas of Global Development*. It is one page that works two ways: a deck driven
from the keyboard at the podium, and an article someone can read on their own afterwards.

**Live:** https://mafiatun.github.io/four-years-left/

`PLAN.md` is the specification — every section, the design system, the presentation layer and
the comparison system are defined there. `FIREBASE.md` covers the live quiz database.

## Running it

```bash
npm install
npm run dev            # http://localhost:5173/four-years-left/
npm run build          # static site into build/
npm run preview        # serve the production build
```

The site makes **zero external network requests at runtime**. Fonts are self-hosted in
`static/fonts`, and all data is imported from `static/data/*.json` at build time rather than
fetched, so the whole briefing runs from localhost with the wifi off. The one exception is the
optional live quiz, which talks to the Firebase URL in `src/lib/quiz-config.js` and degrades
silently to offline mode when that is empty or unreachable.

## The briefing

| Scene | Section | What it does |
| --- | --- | --- |
| 0 | `/quiz/results` | The opening quiz: invitation with QR code, five reveals, room score |
| 1 | `Hero`, `KeyFacts` | The promise, and where the headline numbers stand |
| 2 | `PovertyVote` | The room guesses the direction of extreme poverty, then the truth draws in |
| 3 | `Stall` | Where progress stopped |
| 4 | `Waffle` | The report card |
| 5 | `Goals17` | Seventeen goals, three stories |
| 6 | `WorldRegions` | The geography of progress |
| 7 | `Portraits` | Three countries close up |
| 8 | `Finland` | Nobody has finished |
| 9 | `Projection`, `Explorer`, `Endmatter` | Four years, then the floor |

Sections live in [src/lib/sections/](src/lib/sections/) and are composed in
[src/routes/+page.svelte](src/routes/+page.svelte).

## Presenting

Every scene boundary and every scrolly step registers itself as a *stop*
([src/lib/stores/stops.svelte.js](src/lib/stores/stops.svelte.js)). Scrolly states are a pure
function of scroll position, so driving the scroll drives the story — the keys below just move
between stops, and the article and the deck can never disagree.

| Key | Action |
| --- | --- |
| `→` `↓` `Space` `PageDown` | Next stop |
| `←` `↑` `PageUp` | Previous stop |
| `Home` / `End` | First / last stop |
| `1`–`9` | Jump to that scene |
| `0` | Cross to the quiz screen |
| `S` | Show the room's score, whenever you decide to close the quiz |
| `B` | Blank to navy — eyes on you, not the slide |
| `F` | Fullscreen |
| `?` | Key help |
| `Esc` | Close help, unblank |

A progress rail on the right edge shows where you are in the hour and doubles as an escape
hatch during Q&A. Reduced motion is honoured from `prefers-reduced-motion` and from a manual
toggle; the fallback is always a crossfade, never removal of content.

### Scene 2 is interactive

The poverty chart asks the room to commit before it answers. The three buttons only draw a
dashed guess line, and the chart keeps a neutral question as its title. The finding —
*extreme poverty fell from 32.0% to 9.3% in a single generation* — becomes the title at the
moment you press **Reveal the actual numbers**, alongside the true line drawing itself in.
*Guess again* resets both for rehearsal.

## The quiz

A Gapminder-style opener. Phones answer at `/quiz`, the room's answers are revealed at
`/quiz/results`.

- **Phone page** — mobile first, one question per screen, no names, no cookies, no analytics.
- **Presenter page** — invitation with the QR code and a live "N answered so far" counter,
  then one reveal per question: horizontal bars of the room's distribution, the correct option
  in green, a dashed chimp line at 33 percent, and the fact with its source. Ends on the
  room's average against 33 percent.
- **Transport** — REST only, no Firebase SDK. `POST {QUIZ_DB}/responses.json` to submit,
  polled every 2s while the quiz is on screen, tallied client side. `Shift+R` twice within two
  seconds clears the database between runs.
- **Degradation is mandatory** — with `QUIZ_DB` empty or the network down, phones still score
  locally and the reveals still show the answer, chimp line, fact and source without the room's
  bars. No error ever surfaces on screen.

Set the database URL in [src/lib/quiz-config.js](src/lib/quiz-config.js); `FIREBASE.md` has the
setup and the security rules.

## Stack

SvelteKit (Svelte 5, runes) with `adapter-static`, fully prerendered. Tailwind for layout.
Charts are hand-built Svelte components rendering SVG — `d3-scale`, `d3-shape`, `d3-array` and
`d3-geo` are used as maths helpers only. No charting library, no Mapbox.

Every chart carries the same furniture: a finding as the title, units in the subtitle, a
coloured accent rule and a linked source line ([ChartFrame.svelte](src/lib/components/ChartFrame.svelte)).
No legend boxes anywhere — direct labels only. Numbers in prose are never hard-coded; they come
from `static/data/derived_stats.json`.

## Deploying

Push to `main`. [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds with
`BASE_PATH=/<repo-name>` and publishes `build/` to GitHub Pages. `npm run build` must pass with
zero console errors before any change lands.
