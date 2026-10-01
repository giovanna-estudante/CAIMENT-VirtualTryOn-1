import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: 'backend',

  envDir: __dirname,

  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './backend/src'),
    },
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
