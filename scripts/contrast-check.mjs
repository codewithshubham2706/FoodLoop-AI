#!/usr/bin/env node
/**
 * WCAG 2.1 AA contrast audit for the FoodLoop AI design tokens.
 * Verifies every text/background pair actually used in the UI.
 * Run: npm run check:contrast   (exit 1 on any failure)
 */

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(fg, bg) {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

const AA_NORMAL = 4.5
const AA_LARGE = 3.0

// [description, fg, bg, threshold] — mirrors real usages in the CSS
const PAIRS = [
  // Light surfaces
  ['body text on surface', '#14231C', '#FFFFFF', AA_NORMAL],
  ['soft text on surface', '#3C5247', '#FFFFFF', AA_NORMAL],
  ['faint text on surface', '#4A6155', '#FFFFFF', AA_NORMAL],
  ['soft text on surface-alt', '#3C5247', '#F2F6F3', AA_NORMAL],
  ['faint text on surface-alt', '#4A6155', '#F2F6F3', AA_NORMAL],
  ['accent link on white', '#0B7A4F', '#FFFFFF', AA_NORMAL],
  ['accent-strong on white', '#08623E', '#FFFFFF', AA_NORMAL],
  ['brand-800 heading on white', '#0B3D2E', '#FFFFFF', AA_NORMAL],
  ['brand-700 tag on surface-alt', '#0F4F3B', '#F2F6F3', AA_NORMAL],
  ['accent-strong badge on accent-soft', '#08623E', '#D7F2E4', AA_NORMAL],
  ['brand-800 icon on accent-soft', '#0B3D2E', '#D7F2E4', AA_NORMAL],
  ['danger error text on white', '#B42318', '#FFFFFF', AA_NORMAL],
  ['warn text on white', '#8A5A00', '#FFFFFF', AA_NORMAL],
  ['ok delta text on white', '#0B7A4F', '#FFFFFF', AA_NORMAL],
  ['amber grade-B on #FDF1DC', '#8A5A00', '#FDF1DC', AA_NORMAL],
  ['danger status on #FDE8E6', '#B42318', '#FDE8E6', AA_NORMAL],
  ['white on primary button', '#FFFFFF', '#0B7A4F', AA_NORMAL],

  // Dark surfaces
  ['white on brand-900 footer', '#FFFFFF', '#082B21', AA_NORMAL],
  ['on-dark-soft on brand-900', '#D3E7DD', '#082B21', AA_NORMAL],
  ['on-dark-faint on brand-900', '#9DBFAF', '#082B21', AA_NORMAL],
  ['mint link on brand-900', '#A7F3D0', '#082B21', AA_NORMAL],
  ['on-dark-soft on brand-800', '#D3E7DD', '#0B3D2E', AA_NORMAL],
  ['mint badge on brand-800', '#A7F3D0', '#0B3D2E', AA_NORMAL],
  ['white on accent step tile', '#FFFFFF', '#0B3D2E', AA_NORMAL],
  ['on-dark-soft hero sub', '#D3E7DD', '#0B3D2E', AA_NORMAL],
  ['on-dark-faint hero proof', '#9DBFAF', '#0B3D2E', AA_NORMAL],
  ['mint hero em', '#A7F3D0', '#0B3D2E', AA_NORMAL],
  ['white h1 on hero', '#FFFFFF', '#0B3D2E', AA_NORMAL],

  // Large-text / UI exceptions
  ['brand-800 on accent eyebrow (large bold)', '#0B3D2E', '#D7F2E4', AA_NORMAL],
  ['accent step icon (UI component)', '#A7F3D0', '#0B3D2E', AA_LARGE],
]

// Dark theme (default) — mirrors the :root token block in src/index.css
const DARK_PAIRS = [
  ['body ink on surface', '#E8F2EC', '#14231C', AA_NORMAL],
  ['soft ink on surface', '#B9CEC4', '#14231C', AA_NORMAL],
  ['faint ink on surface', '#93ACA0', '#14231C', AA_NORMAL],
  ['soft ink on surface-alt', '#B9CEC4', '#0F1A15', AA_NORMAL],
  ['faint ink on surface-alt', '#93ACA0', '#0F1A15', AA_NORMAL],
  ['accent link on surface', '#34D399', '#14231C', AA_NORMAL],
  ['accent-strong on surface', '#6EE7B7', '#14231C', AA_NORMAL],
  ['brand-800 heading on surface', '#9BEEC9', '#14231C', AA_NORMAL],
  ['brand-700 tag on surface-alt', '#7CE0B8', '#0F1A15', AA_NORMAL],
  ['accent-strong badge on accent-soft', '#6EE7B7', '#123A2E', AA_NORMAL],
  ['brand-800 icon on accent-soft', '#9BEEC9', '#123A2E', AA_NORMAL],
  ['danger on surface', '#F87171', '#14231C', AA_NORMAL],
  ['warn on surface', '#FBBF24', '#14231C', AA_NORMAL],
  ['ok on surface', '#4ADE80', '#14231C', AA_NORMAL],
  ['warn on warn-bg', '#FBBF24', '#3A2A08', AA_NORMAL],
  ['danger on danger-bg', '#F87171', '#3B1410', AA_NORMAL],
  ['primary-button ink on accent', '#06281E', '#34D399', AA_NORMAL],
  ['ink on brand-deep tile', '#E8F2EC', '#102B22', AA_NORMAL],
  ['on-dark-soft on brand-deep', '#D3E7DD', '#102B22', AA_NORMAL],
  ['on-dark-faint on brand-deep', '#9DBFAF', '#102B22', AA_NORMAL],
  ['mint accent on brand-deep', '#A7F3D0', '#102B22', AA_NORMAL],
  ['ink on brand-900 (footer/hero)', '#E8F2EC', '#0A1F19', AA_NORMAL],
  ['on-dark-soft on brand-900', '#D3E7DD', '#0A1F19', AA_NORMAL],
  ['on-dark-faint on brand-900', '#9DBFAF', '#0A1F19', AA_NORMAL],
  ['mint on brand-900', '#A7F3D0', '#0A1F19', AA_NORMAL],
  ['faint on accent-soft (nav hover)', '#93ACA0', '#123A2E', AA_NORMAL],
]

let failed = false
console.log('WCAG 2.1 AA contrast audit — FoodLoop AI tokens\n')

console.log('— Light theme —\n')
for (const [desc, fg, bg, min] of PAIRS) {
  const r = ratio(fg, bg)
  const ok = r >= min
  if (!ok) failed = true
  console.log(
    `${ok ? '✓' : '✗'} ${r.toFixed(2).padStart(5)} : 1  (min ${min})  ${desc}  ${fg} on ${bg}`,
  )
}

console.log('\n— Dark theme (default) —\n')
for (const [desc, fg, bg, min] of DARK_PAIRS) {
  const r = ratio(fg, bg)
  const ok = r >= min
  if (!ok) failed = true
  console.log(
    `${ok ? '✓' : '✗'} ${r.toFixed(2).padStart(5)} : 1  (min ${min})  ${desc}  ${fg} on ${bg}`,
  )
}

if (failed) {
  console.error('\n✗ Some pairs fail AA. Fix tokens in src/index.css before shipping.')
  process.exit(1)
}
console.log('\n✓ All text/background pairs pass WCAG 2.1 AA.')
