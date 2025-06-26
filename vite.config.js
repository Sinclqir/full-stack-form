import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration conditionnelle selon l'environnement
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProduction ? '/' : '/full-stack-form/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true
    },
    hmr: {
      clientPort: 3000
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
