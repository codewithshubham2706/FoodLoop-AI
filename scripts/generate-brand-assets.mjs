/**
 * Generates raster brand assets from SVG sources:
 *  - public/brand/favicon.svg  → public/apple-touch-icon.png (180×180)
 *                              → public/favicon-48.png      (48×48)
 *  - scripts/og-template.svg   → public/og-image.png        (1200×630)
 *
 * Run: npm run assets:brand
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function svgToPng(svgPath, outPath, width, height) {
  const svg = await readFile(path.join(root, svgPath))
  await sharp(svg, { density: 300 })
    .resize(width, height)
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(root, outPath))
  console.log(`✓ ${outPath} (${width}×${height})`)
}

await svgToPng('public/brand/favicon.svg', 'public/apple-touch-icon.png', 180, 180)
await svgToPng('public/brand/favicon.svg', 'public/favicon-48.png', 48, 48)
await svgToPng('scripts/og-template.svg', 'public/og-image.png', 1200, 630)
console.log('Brand assets generated.')
