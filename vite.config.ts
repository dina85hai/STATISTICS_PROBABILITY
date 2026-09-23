import { defineConfig, Plugin } from 'vite'
import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

// Standalone lesson pages: every .html file in lessons/ is published at the site
// root under the same name, with the shared learner.js added.
const lessonsDir = resolve(__dirname, 'lessons')

// Changes on every build so browsers fetch the new learner.js right after a deploy.
const buildVersion = Date.now().toString(36)

// Adds the shared Home button / progress script (public/learner.js) to a page.
function withLearner(html: string, lesson: string) {
  return html.replace(/<\/body>/i, `  <script src="./learner.js?v=${buildVersion}" data-lesson="${lesson}"></script>\n</body>`)
}

function copyLessons(): Plugin {
  return {
    name: 'copy-lessons',
    apply: 'build',
    generateBundle() {
      for (const fileName of readdirSync(lessonsDir).filter((f) => f.endsWith('.html'))) {
        const html = readFileSync(resolve(lessonsDir, fileName), 'utf8')
        this.emitFile({ type: 'asset', fileName, source: withLearner(html, fileName.replace(/\.html$/, '')) })
      }
    },
  }
}

// Cache-busts the learner.js tag already written in the built pages.
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

export default defineConfig({
  base: './',
  plugins: [copyLessons(), versionLearner()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        presentation: resolve(__dirname, 'presentation.html'),
        'statistics-notes': resolve(__dirname, 'statistics-notes.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
})
