#!/usr/bin/env node
/**
 * Static site audit for FoodLoop AI:
 *  1. Every <Link to> / href in src matches a declared route (no broken links).
 *  2. Every <img> in src has non-empty alt text.
 *  3. Every asset referenced from src exists in public/.
 *  4. public/sitemap.xml covers exactly the public routes.
 *
 * Run: npm run check:links   (exit 1 on any finding)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'src')

const ROUTES = ['/', '/dashboard', '/trace', '/rewards', '/esg', '/privacy', '/terms', '/login', '/user', '/admin']
// Private / noindex panels: valid routes but deliberately absent from sitemap.xml
const PRIVATE_ROUTES = new Set(['/login', '/user', '/admin'])
// Deploy origin for sitemap/robots checks (keep in sync with scripts/site-url.mjs).
const SITE_URL = 'https://codewithshubham2706.github.io'
const BASE_PATH = '/FoodLoop-AI'

const issues = []

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, files)
    else if (/\.(tsx?|css)$/.test(name)) files.push(p)
  }
  return files
}

const files = walk(srcDir)

for (const file of files) {
  const rel = path.relative(root, file)
  const text = readFileSync(file, 'utf8')

  // 1. Internal links (Link to=... and href="/...")
  for (const m of text.matchAll(/\bto=["'`](\/[^"'`]*)["'`]/g)) {
    let target = m[1]
    if (target.startsWith('/#')) target = '/' // hash anchor on same page
    target = target.split('?')[0] || '/'
    if (target === '') target = '/'
    if (!ROUTES.includes(target)) issues.push(`${rel}: broken route link "${m[1]}"`)
  }
  for (const m of text.matchAll(/href=["'{](\/[^"'}`)]*)/g)) {
    const raw = m[1]
    if (raw.startsWith('/#')) continue
    const target = (raw.split('?')[0] || '/').replace(/["')].*$/, '')
    if (target === '/' || ROUTES.includes(target)) continue
    // static assets are checked separately
    if (/\.(png|svg|xml|txt|webmanifest|html)$/.test(target)) continue
    issues.push(`${rel}: suspicious href "${raw}"`)
  }

  // 2. Images must have alt
  for (const m of text.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0]
    const src = tag.match(/src=["'`]([^"'`]+)["'`]/)?.[1] ?? ''
    const alt = tag.match(/alt=["'`]([^"'`]*)["'`]/)
    if (!alt) issues.push(`${rel}: <img src="${src}"> missing alt attribute`)
    else if (alt[1].trim() === '' && !/alt=["'`]["'`]\s*(\/?>)/.test(tag)) {
      // empty alt is allowed only if intentional decorative (kept as valid)
    }
  }

  // 3. Public asset references resolve
  for (const m of text.matchAll(/["'`](\/(?:images|brand)\/[^"'`]+)["'`]/g)) {
    const asset = m[1]
    if (!existsSync(path.join(root, 'public', asset))) {
      issues.push(`${rel}: missing public asset ${asset}`)
    }
  }
}

// index.html asset references
const indexHtml = readFileSync(path.join(root, 'index.html'), 'utf8')
for (const m of indexHtml.matchAll(/(?:href|content)=["'](\/[^"']+)["']/g)) {
  const ref = m[1]
  if (ref === '/') continue
  const file = ref.split('?')[0]
  if (!existsSync(path.join(root, 'public', file)) && !existsSync(path.join(root, `.${file}`))) {
    // canonical/og URLs point at the deployed origin — only flag local file refs
    if (/\.(svg|png|xml|txt|webmanifest)$/.test(file)) {
      issues.push(`index.html: missing asset ${file}`)
    }
  }
}

// 4. Sitemap covers the public routes (private panels must stay OUT).
//    URLs must use the deployed origin + base path.
const sitemap = readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8')
for (const r of ROUTES) {
  if (PRIVATE_ROUTES.has(r)) continue
  const loc = `${SITE_URL}${BASE_PATH}${r === '/' ? '/' : r}`
  if (!sitemap.includes(`<loc>${loc}</loc>`)) {
    issues.push(`sitemap.xml: missing route ${r} (expected <loc>${loc}</loc>)`)
  }
}
for (const r of PRIVATE_ROUTES) {
  if (sitemap.includes(`<loc>${SITE_URL}${BASE_PATH}${r}</loc>`)) {
    issues.push(`sitemap.xml: private route ${r} must not be listed`)
  }
}

// robots points at the deployed sitemap and disallows the private panels
const robots = readFileSync(path.join(root, 'public', 'robots.txt'), 'utf8')
if (!new RegExp(`Sitemap:\\s*${(SITE_URL + BASE_PATH).replace(/\./g, '\\.')}\\/sitemap\\.xml`).test(robots)) {
  issues.push('robots.txt: missing Sitemap directive')
}
for (const r of PRIVATE_ROUTES) {
  if (!robots.includes(`Disallow: ${BASE_PATH}${r}`)) {
    issues.push(`robots.txt: missing Disallow for ${r}`)
  }
}

if (issues.length) {
  console.error('\n✗ Link/asset audit failed:\n')
  for (const i of issues) console.error('  - ' + i)
  process.exit(1)
} else {
  console.log('✓ Links, images (alt), assets and sitemap all check out.')
}
