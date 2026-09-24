# Statistics + Probability

Self-learning lessons for statistics and probability, published with GitHub Pages at
https://dina85hai.github.io/STATISTICS_PROBABILITY/

## Learning path

1. **Statistics**: Mean, Mode, Median, Range, Variance & Standard Deviation (`statistics-notes.html`)
2. **Probability**: Presentation & Practice Arena (`presentation.html`) → Gen Z Exercises → Worksheet & Answers

## Files

| File | What it is |
|---|---|
| `index.html` | Landing page (learning path, progress) |
| `statistics-notes.html` | Statistics notes (formulas are rendered by `src/statistics.ts`) |
| `presentation.html` | Probability slides + Practice Arena (styles compiled by Tailwind) |
| `lessons/*.html` | Stand-alone lesson pages, copied to the site as they are |
| `public/learner.js` | Lesson list (`TOPICS`), Home / Mark as done / Next buttons, progress, self-test mode |

## Adding a new lesson

1. Put the lesson's `.html` file in the `lessons/` folder, for example `lessons/histogram.html`.
   Use a short name with no spaces.
2. In `public/learner.js`, add an entry to the right topic in `TOPICS`, with
   `id: 'histogram'` and `url: 'histogram.html'`.

That's it: the landing page card, Home button, Mark as done and Next button are added
automatically. If the answers are inside elements with `class="answer"`, self-test mode
hides them too. Fractions typed as `3/10` (or `n(A)/n(S)`) are shown as stacked fractions
automatically; for words, write `<span class="sp-frac"><span>top</span><span>bottom</span></span>`.
Push to `main` and the site redeploys.

In the statistics notes, each worked example starts with its formula (`class="formula"`), and
every step is typeset with KaTeX via `<span class="tex" data-tex="...">`.

## Local development

```
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # check the TypeScript files
npm run build      # output in dist/
```
