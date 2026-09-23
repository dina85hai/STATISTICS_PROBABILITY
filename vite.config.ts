import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Standalone lesson pages, published under URL-safe names.
const staticPages: Record<string, string> = {
  'PROBABILITY.html': 'probability-notes.html',
  'EXERCISE PROBABILITY.html': 'probability-exercise.html',
  'mean, mode, median, variance.html': 'statistics-notes.html',
  'probability_answer_key for teacher.html': 'answer-key.html',
}

// Changes on every build so browsers fetch the new learner.js right after a deploy.
const buildVersion = Date.now().toString(36)

// Adds the shared Home button / progress script (public/learner.js) to a page.
function withLearner(html: string, lesson: string) {
  return html.replace(/<\/body>/i, `  <script src="./learner.js?v=${buildVersion}" data-lesson="${lesson}"></script>\n</body>`)
}

// Cache-busts the learner.js tag already written in index.html / presentation.html.
function versionLearner(): Plugin {
  return {
    name: 'version-learner',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html) => html.replace('src="./learner.js"', `src="./learner.js?v=${buildVersion}"`),
    },
  }
}

function copyStaticPages(): Plugin {
  return {
    name: 'copy-static-pages',
    apply: 'build',
    generateBundle() {
      for (const [source, fileName] of Object.entries(staticPages)) {
        const html = readFileSync(resolve(__dirname, source), 'utf8')
        this.emitFile({ type: 'asset', fileName, source: withLearner(html, fileName.replace('.html', '')) })
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), copyStaticPages(), versionLearner()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        presentation: resolve(__dirname, 'presentation.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
})
