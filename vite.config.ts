import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    // Keep a single lean bundle — the app is small; smaller graph = faster first paint.
    cssCodeSplit: false,
    reportCompressedSize: true,
  },
})
