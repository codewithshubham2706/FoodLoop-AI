// Keep in sync with src/lib/env.ts and .env.example.
// Scripts can't import Vite's import.meta.env, so read a .env if present.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

let url = 'https://foodloop.ai'
try {
  const env = readFileSync(path.join(root, '.env'), 'utf8')
  const match = env.match(/^VITE_SITE_URL=(.+)$/m)
  if (match) url = match[1].trim().replace(/\/+$/, '')
} catch {
  /* no .env — use default */
}

export const SITE_URL = url
