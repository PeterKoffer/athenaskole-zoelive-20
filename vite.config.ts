import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
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