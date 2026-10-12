# Four Years Left

A scrollytelling briefing on **Artificial Intelligence, the Sustainable Development Goals and the
UN 2030 Agenda**, built for **Io Sono Futuro – I Am The Future**, the national programme of
Fondazione Della Frera ETS that identifies and supports young Italian talent. Its 2026 New York
mission brings Italian high school and university students whose AI based project ideas take on
emerging global challenges. This briefing shows them where the 2030 Agenda actually stands, so
they can see where their ideas fit.

It is written in the style of the World Bank *Atlas of Global Development*, and it is one page
that works two ways: a deck driven from the keyboard at the front of the room, and an article a
student can read on their own afterwards.

**Live:** <https://mafiatun.github.io/four-years-left/>

`PLAN.md` is the specification — every section, the design system, the presentation layer and
the comparison system are defined there. `FIREBASE.md` covers the live quiz database.

## Running order on the day

The opening is three screens, each handing over to the next with the same forward key.

1. **The quiz** — [/quiz/results/](https://mafiatun.github.io/four-years-left/quiz/results/).
   Project it, let the room scan the QR code, walk the five reveals, land on the room's score.
2. **The speaker** — [/speaker/](https://mafiatun.github.io/four-years-left/speaker/).
   Next on the quiz score lands here: Mafizul Islam, Senior Adviser (Data, AI and Strategic
   Foresight), Office of the President of the UN General Assembly, 81st session, with a record,
   certifications and a LinkedIn QR code.
3. **The briefing** — [the main page](https://mafiatun.github.io/four-years-left/), from the
   hero through the nine scenes below.

Quiz and Speaker are also in the header of the main page, so either is one click away during
Q&A. Before the students walk in, press `Shift+R` twice on the quiz screen to clear any answers
left over from rehearsal.

## Running it

```bash
npm install
npm run dev                         # http://localhost:5173/four-years-left/
npm run build                       # static site into build/
npm run preview                     # serve the production build
node scripts/verify-numbers.mjs     # every on screen figure against derived_stats.json
node scripts/shot.mjs out.png "/#stall" 2.5   # screenshot any scroll position (needs preview running)
```

The site makes **zero external network requests at runtime**. Fonts are self-hosted in
`static/fonts`, the speaker's photo and both QR codes are in `static/`, and all data is imported
from `static/data/*.json` at build time rather than fetched, so the whole briefing runs from
localhost with the wifi off — which matters on venue wifi you have never tested. The one
exception is the optional live quiz, which talks to the Firebase URL in
`src/lib/quiz-config.js` and degrades silently to offline mode when that is empty or unreachable.

## The briefing

| Scene | Section | What it does |
| --- | --- | --- |
| 0 | `/quiz/results` | The opening quiz: invitation with QR code, five reveals, room score |
| — | `/speaker` | Who is talking: role, record, certifications and a LinkedIn QR code |
| 1 | `Hero`, `KeyFacts` | The promise, and where the headline numbers stand |
| 2 | `PovertyVote` | The room guesses the direction of extreme poverty, then the truth draws in |
| 3 | `Stall` | Where progress stopped |
| 4 | `Waffle` | The report card |
| 5 | `Goals17` | Seventeen goals, three stories |
| 6 | `WorldRegions` | The geography of progress |
| 7 | `Portraits` | Three countries close up |
| 8 | `Finland` | Nobody has finished |
| 9 | `Projection`, `Explorer`, `Endmatter` | Four years, then the floor — and where an AI project fits |

Sections live in [src/lib/sections/](src/lib/sections/) and are composed in
[src/routes/+page.svelte](src/routes/+page.svelte).

**Italy is the room's reference line.** The room is Italian, so Italy is drawn alongside the world
on the Stall chart, stays marked on every Portraits step, is pinned on the world map and leads the
explorer's country chips. Change it in one place: `HOME` in
[src/lib/tokens.js](src/lib/tokens.js).

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

On the speaker screen, forward starts the briefing, back returns to the quiz score, `0` goes to
the quiz and `F` toggles fullscreen.

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
  room's average against 33 percent, and Next from there goes to the speaker.
- **Transport** — REST only, no Firebase SDK. `POST {QUIZ_DB}/responses.json` to submit,
  polled every 2s while the quiz is on screen, tallied client side. `Shift+R` twice within two
  seconds clears the database between runs.
- **Degradation is mandatory** — with `QUIZ_DB` empty or the network down, phones still score
  locally and the reveals still show the answer, chimp line, fact and source without the room's
  bars. No error ever surfaces on screen.

Set the database URL in [src/lib/quiz-config.js](src/lib/quiz-config.js); `FIREBASE.md` has the
setup, the security rules and the log of when the database was last cleared.

## Host and speaker

The host's names — programme, English title, foundation, occasion — live in
[src/lib/host.js](src/lib/host.js) and appear in the header, hero, endmatter and both quiz
screens. There is no logo: the programme's name is set in type beside a UN blue bar.

The speaker's facts live in [src/lib/speaker.js](src/lib/speaker.js), taken from the bio supplied
for the PGA81 staff directory on 15 September 2026. Edit wording there, never in the page.
`static/qr-linkedin.svg` must encode `SPEAKER.linkedin` exactly; if the address changes,
regenerate it with the same settings as the quiz QR code:

```bash
python3 -c "import segno; segno.make('https://www.linkedin.com/in/mafizul/', error='m').save('static/qr-linkedin.svg', scale=10, dark='#0b1b3f', border=2)"
```

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
