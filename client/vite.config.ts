import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Directory to output the build files
  },
  resolve: {
    alias: {
      '@': '/src', // Set up path alias for easier imports
    },
  },
})
