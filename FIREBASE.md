# Live quiz results backend, ten minute setup

> **Already done, 9 August 2026.** The setup below was carried out with the Firebase CLI.
> Nothing here is left to do before the briefing.
>
> | What | Where |
> | --- | --- |
> | Project | `four-years-left-sdg` ("Four Years Left"), owner samsumon@gmail.com |
> | Database | `https://four-years-left-sdg-default-rtdb.firebaseio.com`, us-central1 |
> | Console | <https://console.firebase.google.com/project/four-years-left-sdg/database> |
> | Wired at | `src/lib/quiz-config.js`, `QUIZ_DB` |
>
> The database does **not** run in test mode, so nothing expires in 30 days. Rules live in
> `database.rules.json`: anonymous read and write on `/responses` only, each row validated
> as exactly q1 to q5 in the range 0 to 2 plus a numeric `ts`, everything else denied.
> Redeploy them any time with `npx firebase-tools deploy --only database`.
>
> Verified live: three phone submissions landed, the presenter counter and bars picked them
> up inside one poll, shift+R twice wiped the database, and the reveal fell back to the
> chimp benchmark.
>
> **Not yet wiped for Io Sono Futuro.** On 9 October 2026 the database still held 63 responses
> from the previous session. Press shift+R twice on the presenter page (or send
> `DELETE /responses.json`) before the students walk in, or their bars start from someone
> else's answers.

The quiz works in three tiers. Tier one, live room results, needs this Firebase setup.
Tier two needs nothing: phones score locally and the reveal shows correct answers with
the chimp benchmark. Tier three is hands up voting on the same reveal screens.
The site auto detects: if the Firebase URL below is unreachable it falls back to tier two.

## Setup (do this tonight, not tomorrow morning)

1. Go to console.firebase.google.com, sign in with any Google account, Add project,
   name it four-years-left, disable Analytics, create.
2. In the left menu open Build, Realtime Database, Create Database, choose the
   United States location, start in test mode.
   Test mode expires in 30 days, which is fine for a one day event.
3. Copy the database URL, it looks like
   https://four-years-left-default-rtdb.firebaseio.com
4. Put that URL in src/lib/quiz-config.js as QUIZ_DB. Rebuild, push.

## How the site uses it (already specified for Claude Code, REST only, no SDK)

Phone submits once:  POST {QUIZ_DB}/responses.json  body {"q1":2,"q2":0,...,"ts":...}
Presenter page polls: GET {QUIZ_DB}/responses.json every 2 seconds and tallies client side.
Reset between rehearsal and the real briefing: DELETE {QUIZ_DB}/responses.json
(the presenter page has a hidden reset button, press shift+R twice).

No names, no accounts, no cookies. The payload is five integers and a timestamp,
which keeps the promise of full anonymity you will make from the podium.

## Checklist on the day

Open the database console tab so you can watch rows arrive during rehearsal.
Submit one test response from your own phone on mobile data, not wifi, which also proves the
room does not need the venue network for this to work. Press shift+R twice on the presenter
page to clear test data before the students walk in.
