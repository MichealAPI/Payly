import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const api = env.VITE_API_ENDPOINT || 'http://localhost:5000';
  const apiOrigin = new URL(api).origin;

  return {
    plugins: [
      react(),
      tailwindcss(),
      // Generate compressed assets for production (gzip + brotli)
      compression({ algorithm: 'gzip' }),
      compression({ algorithm: 'brotliCompress', ext: '.br' }),
  // PWA handled via static manifest and public/sw.js
      sentryVitePlugin({
        org: "mikeslaboratory",
        project: "payly"
      })
    ],


    server: {
      headers: {
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": `
          default-src 'self';
          img-src 'self' data: https://res.cloudinary.com https://placehold.co https://flagpedia.net https://cdn.jsdelivr.net;
          script-src 'self' 'unsafe-inline' 'unsafe-eval';
          style-src 'self' 'unsafe-inline';
          connect-src 'self' ${apiOrigin} ws: wss: data: https://cdn.jsdelivr.net https://api.github.com;
        `.replace(/\s+/g, ' ').trim(),
      },
      proxy: {
        '/api': {
          target: api,
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
  }
})