// Keep in sync with src/lib/env.ts and .env.example.
// Scripts can't import Vite's import.meta.env, so read a .env if present.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

let url = 'https://codewithshubham2706.github.io'
let basePath = ''
try {
  const env = readFileSync(path.join(root, '.env'), 'utf8')
  const siteMatch = env.match(/^VITE_SITE_URL=(.+)$/m)
  if (siteMatch) url = siteMatch[1].trim().replace(/\/+$/, '')
  const baseMatch = env.match(/^VITE_BASE_PATH=(.*)$/m)
  if (baseMatch) basePath = baseMatch[1].trim().replace(/\/+$/, '')
} catch {
  /* no .env — use defaults */
}

// Site URL without trailing slash + base path ('' or '/FoodLoop-AI').
export const SITE_URL = url
export const BASE_PATH = basePath
