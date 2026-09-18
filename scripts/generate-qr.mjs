/**
 * Generates the demo batch QR code → public/images/batch-qr.png (320×320).
 * Run: npm run assets:qr
 */
import QRCode from 'qrcode'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL, BASE_PATH } from './site-url.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const demoUrl = `${SITE_URL}${BASE_PATH}/trace?batch=FL-2026-0042`

await QRCode.toFile(path.join(root, 'public/images/batch-qr.png'), demoUrl, {
  width: 640,
  margin: 2,
  errorCorrectionLevel: 'M',
  color: { dark: '#0B3D2E', light: '#FFFFFF' },
})

console.log(`✓ public/images/batch-qr.png → ${demoUrl}`)
