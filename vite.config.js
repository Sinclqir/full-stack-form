import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Le nom du repo GitHub ici :
const repoName = 'full-stack-form';

export default defineConfig({
  base: `/${repoName}/`,
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
  }
})
