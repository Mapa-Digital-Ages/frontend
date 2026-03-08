import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('@mui') || id.includes('@emotion')) {
            return 'mui'
          }

          if (
            id.includes('react') ||
            id.includes('scheduler') ||
            id.includes('react-router')
          ) {
            return 'react'
          }

          return 'vendor'
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
