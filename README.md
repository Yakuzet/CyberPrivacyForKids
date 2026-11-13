# ByteGuard Academy

A website that teaches kids (ages 7–13) about online privacy, cybersecurity, and thinking for themselves in the age of AI.

## Features

- **6 step-by-step courses.** Each one unlocks the next:
  1. Privacy: Your Info Is Treasure
  2. Privacy: Footprints That Never Wash Away
  3. Cybersecurity: Password Power
  4. Cybersecurity: Spot the Phish
  5. Cybersecurity: Viruses & Sneaky Software
  6. Think for Yourself: AI Is Not Your Brain
- **Read-aloud lessons.** Every lesson starts reading automatically in a natural neural voice, and each sentence is highlighted as it's read.
- **Hand-picked YouTube videos** in every course, played in YouTube's privacy-enhanced mode.
- **Quizzes, badges and a printable certificate.**
- **4 games:** Password Power Meter, Phish or Legit?, Share or Keep Secret?, The Robot Said What?
- **A secret course** that unlocks after the AI course. Enter if you dare.

## Running it

It's a plain static site with no build step.

**On Windows**, double-click `start.bat`. It starts a small local server and opens http://localhost:5173 in your browser. Keep the black window open while you use the site.

**Anywhere else**, serve the folder with any web server:

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

> If you open `index.html` directly (a `file://` address), YouTube refuses to play videos inside the page (Error 153), because it needs to know which website is asking. In that case the site opens each video on YouTube in a new tab instead. Hosting the site anywhere, such as GitHub Pages, makes the videos play inside the page.

## Updating the voice

All spoken lines are pre-recorded into `audio/` with free Microsoft neural voices through [edge-tts](https://github.com/rany2/edge-tts). After you change any text in `js/content.js` or `js/speech.js`, run:

```bash
python -m pip install edge-tts
node tools/build-voice.js
```

Only new or changed lines are recorded. If a line has no clip, the site uses the browser's built-in voice instead.

## Project layout

| Path | What it is |
|---|---|
| `index.html` | Page shell |
| `css/style.css` | All styles, including the horror theme |
| `js/content.js` | Course lessons, quizzes, videos, secret course |
| `js/speech.js` | Game content and every spoken line |
| `js/app.js` | Router, read-aloud player, games |
| `tools/build-voice.js` | Voice recording script |
| `audio/` | Pre-recorded voice clips and manifest |
