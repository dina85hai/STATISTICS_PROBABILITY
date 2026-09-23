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

function copyStaticPages(): Plugin {
  return {
    name: 'copy-static-pages',
    apply: 'build',
    generateBundle() {
      for (const [source, fileName] of Object.entries(staticPages)) {
        this.emitFile({ type: 'asset', fileName, source: readFileSync(resolve(__dirname, source)) })
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), copyStaticPages()],
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
