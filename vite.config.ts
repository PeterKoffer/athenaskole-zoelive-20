import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    host: "127.0.0.1",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:54321",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/socket.io": {
        target: "ws://localhost:3000",
        ws: true,
      },
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress all warnings during development
        if (mode === 'development') return;
        warn(warning);
      },
    },
  },
  esbuild: {
    drop: mode === 'production' ? ['console'] : [],
    legalComments: 'none',
    target: 'es2020',
    logLevel: 'silent',
    ignoreAnnotations: true,
  },
  plugins: [
    react({
      babel: {
        compact: false,
        plugins: mode === 'development' ? [] : undefined
      }
    }),
    mode === 'development' && componentTagger(),
    // Development-only plugin to suppress TypeScript errors
    mode === 'development' && {
      name: 'suppress-ts-dev', 
      configResolved(config) {
        if (mode === 'development') {
          // Disable TypeScript checking in development
          config.esbuild = {
            ...config.esbuild,
            target: 'es2020',
            treeShaking: false,
            keepNames: true,
            format: 'esm'
          };
        }
      }
    }
  ].filter(Boolean),
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': mode === 'development' ? '"development"' : '"production"',
    'process.env.VITE_SKIP_TS_CHECK': mode === 'development' ? '"true"' : '"false"',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))