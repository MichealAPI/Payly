import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sentryVitePlugin({
    org: "mikeslaboratory",
    project: "payly"
  })],

  server: {
    headers: {
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": `
        default-src 'self';
        img-src 'self' data: https://res.cloudinary.com;
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        connect-src 'self' ws: wss:;
      `.replace(/\s{2,}/g, '').trim(),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    assetsInlineLimit: 0,
    sourcemap: true
  }
})