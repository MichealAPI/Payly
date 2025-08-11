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
        img-src 'self' data: https://res.cloudinary.com https://placehold.co https://flagpedia.net;
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        connect-src 'self' ws: wss:;
      `.replace(/\s{2,}/g, '').trim(),
    },
    proxy: {
      '/api': {
        target: process.env.API || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    assetsInlineLimit: 0,
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('@react-three/fiber') || id.includes('@react-three/drei')) return 'r3f';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
            if (id.includes('redux') || id.includes('@reduxjs/toolkit')) return 'vendor-state';
            if (id.includes('axios') || id.includes('emoji-picker-react') || id.includes('framer-motion')) return 'vendor-ui';
            return 'vendor';
          }
        }
      }
    }
  }
})