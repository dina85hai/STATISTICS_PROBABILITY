# Statistics + Probability

Self-learning lessons for statistics and probability, published with GitHub Pages at
https://dina85hai.github.io/STATISTICS_PROBABILITY/

## Learning path

1. **Statistics**: Tabular & Graphical Form (`lessons/data-presentation.html`): syllabus 4.1 statistics terminology,
   discrete/continuous and grouped/ungrouped data, frequency and cumulative frequency tables, pie chart, bar chart,
   histogram and ogive with electrical engineering examples → Mean, Mode, Median, Range, Variance & Standard Deviation (`statistics-notes.html`) → Statistics Lab (`lessons/statistics-lab.html`):
   an Exercise tab laid out like the notes: the same three problems (A raw data, B frequency table, C grouped data)
   side by side for each step (mean, mode, median, range, variance & σ), with the notes' formulas and answer boxes
   placed inside the formula, plus a practice tab of random questions worked the same way, chosen by
   difficulty (easy, medium, hard), data type (raw data, frequency table, grouped data) and measure
   (mean, mode, median, range, variance & standard deviation), or mixed
2. **Probability**: Presentation (`presentation.html`) → Travel Edition (`lessons/probability-destinations.html`):
   syllabus 4.3 subtopics with interactive destination examples → Practice (`lessons/probability-practice.html`): every exercise on one page,
   grouped by skill and ordered from easy to hard

3. **Probability Lab**: Guided binomial and normal distributions (`lessons/probability-lab.html`), with interactive graphs and step-by-step calculations.

## Files

| File | What it is |
|---|---|
| `index.html` | Landing page (learning path, progress) |
| `statistics-notes.html` | Statistics notes (formulas are rendered by `src/statistics.ts`) |
| `presentation.html` | Probability slides (styles compiled by Tailwind) |
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
