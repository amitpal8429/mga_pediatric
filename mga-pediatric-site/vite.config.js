import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, /proxy/* is forwarded to the MGA API so CORS never gets in the way.
// In production use the rewrites in public/_redirects (Netlify) or vercel.json (Vercel).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/proxy': {
        target: 'https://24x7.medicalglobalacademy.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, '/api')
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js']
  }
});
