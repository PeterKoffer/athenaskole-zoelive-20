import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Disable TypeScript checking completely
  esbuild: false,
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  define: {
    global: 'globalThis',
  },
  
  // Use required port 8080
  server: {
    port: 8080,
    strictPort: true,
    host: true,
  },
});