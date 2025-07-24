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
    logLevel: 'error', // Only show errors, suppress warnings
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
        // Set environment variable to allow TypeScript errors in development
        if (mode === 'development') {
          process.env.VITE_SKIP_TS_CHECK = 'true';
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