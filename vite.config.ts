import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // A raiz do Vite é a pasta principal do projeto.
  // Isso permite que o Vite encontre a pasta public/.
  root: __dirname,

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
      // O código React está dentro de backend/src.
      '@': path.resolve(__dirname, './backend/src'),
    },
  },

  build: {
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: true,
  },
})