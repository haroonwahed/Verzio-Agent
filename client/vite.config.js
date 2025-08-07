import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // Proxy API requests to the Express backend.  By default the API
        // runs on port 3000, which matches Replit's PORT as well as local
        // setups.  If you need to use a different port, update this target.
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});