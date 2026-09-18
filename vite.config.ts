import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy base path: '/' locally, '/FoodLoop-AI/' on GitHub Pages (the CI
// deploy job sets VITE_BASE_PATH). import.meta.env.BASE_URL follows this
// value, so app code and the router stay base-path aware.
const base = process.env.VITE_BASE_PATH || '/'
const baseWithSlash = base.endsWith('/') ? base : `${base}/`
const publicBase = (process.env.VITE_SITE_URL || 'https://codewithshubham2706.github.io')
  .replace(/\/+$/, '')
  .concat(baseWithSlash)

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    {
      // index.html uses collision-proof __FL_*__ tokens (NOT %VITE_*% — Vite
      // errors on undefined env placeholders). Written without a trailing
      // slash, e.g. "__FL_BASE__brand/favicon.svg"; the values here always end
      // with a slash, so '/' and '/FoodLoop-AI/' both resolve correctly.
      name: 'base-path-in-index-html',
      transformIndexHtml(html) {
        return html
          .replaceAll('__FL_BASE__', baseWithSlash)
          .replaceAll('__FL_PUBLIC_BASE__', publicBase)
      },
    },
  ],
  build: {
    target: 'es2020',
    // Keep a single lean bundle — the app is small; smaller graph = faster first paint.
    cssCodeSplit: false,
    reportCompressedSize: true,
  },
})
