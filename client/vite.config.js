import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: [
      'all',
      'e1c70e66-b089-4338-95fb-71f984e5e928-00-2w6h563ver3z2.spock.replit.dev'
    ],
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:3002',
        changeOrigin: true,
        secure: false
      }
    }
  }
})