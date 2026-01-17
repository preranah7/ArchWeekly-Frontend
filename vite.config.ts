import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  build: {
    // Disable source maps in production for security
    sourcemap: false,
    
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'state-vendor': ['zustand'],
        },
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // Preview server config
  preview: {
    port: 4173,
    strictPort: true,
  },
  
  // Dev server config
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
})