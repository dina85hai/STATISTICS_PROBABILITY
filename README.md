# Statistics + Probability

Self-learning lessons for statistics and probability, published with GitHub Pages at
https://dina85hai.github.io/STATISTICS_PROBABILITY/

## Learning path

1. **Statistics**: Mean, Mode, Median & Variance
2. **Probability**: Presentation → Notes & Practice Arena → Gen Z Exercises → Worksheet & Answers

## Adding a new lesson

1. Put the lesson's `.html` file in the repository root.
2. In `vite.config.ts`, add it to `staticPages`: `'My Lesson.html': 'my-lesson.html'`.
3. In `public/learner.js`, add an entry to the right topic in `TOPICS`, using
   `id: 'my-lesson'` and `url: 'my-lesson.html'`.

The landing page card, the Home button, Mark as done and the Next button are then added
to the lesson automatically. Push to `main` and the site redeploys.

## Local development

```
npm install
npm run dev      # http://localhost:3000
npm run build    # output in dist/
```
