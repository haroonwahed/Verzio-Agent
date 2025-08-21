
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4000,
    strictPort: true,
    hmr: {
      host: '0.0.0.0',
      port: 4000
    },
    allowedHosts: ['all'],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    },
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8008',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
