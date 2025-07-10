
import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: [
        'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'src/**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      ],
      exclude: [
        'node_modules/',
        'dist/',
        'playwright/**', // Exclude Playwright tests from Vitest
        'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}' // Exclude Playwright test directory
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          'dist/',
          'playwright/**', // Exclude Playwright from coverage
        ],
      },
      reporter: ['verbose', 'junit'],
      outputFile: {
        junit: './test-results/junit.xml',
      },
    },
  })
);
