import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Get mode from command line or default to development
const mode = process.env.NODE_ENV || 'development';

// Component tagger for development
const componentTagger = () => ({
  name: 'component-tagger',
  transform(code: string, id: string) {
    if (id.includes('src/components') && id.endsWith('.tsx')) {
      const componentName = path.basename(id, '.tsx');
      return {
        code: `${code}\n/* Component: ${componentName} */`,
        map: null
      };
    }
  }
});

export default defineConfig({
  plugins: [
    react({
      babel: {
        compact: false,
      }
    }),
    mode === 'development' && componentTagger(),
    // Custom plugin to disable TypeScript checking in development
    mode === 'development' && {
      name: 'disable-typescript-dev',
      config(config) {
        // Disable TypeScript checking
        config.esbuild = false;
      },
    },
  ].filter(Boolean),
  
  // Use JavaScript mode for development to skip TypeScript checking
  esbuild: mode === 'production' ? {
    target: 'es2020',
    drop: ['console', 'debugger'],
  } : false,
  
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress all warnings in development  
        if (mode === 'development') return;
        warn(warning);
      },
    },
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  
  server: {
    port: 5173,
    strictPort: true,
  },
});