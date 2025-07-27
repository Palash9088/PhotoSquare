import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit to 1500 KB (HEIC library is inherently large)
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          // Separate HEIC library (largest dependency)
          'heic-converter': ['heic2any'],
          // Separate ZIP functionality
          'zip-utils': ['jszip'],
          // React vendor chunk
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  }
})
