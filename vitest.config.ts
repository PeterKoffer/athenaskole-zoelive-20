
import { defineConfig as defineVitestConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import baseViteConfigFn from './vite.config'; // Renamed to indicate it's a function

// Call the function to get the base Vite configuration object
// We assume 'test' mode for Vitest context, or Vitest might set process.env.MODE
const mode = process.env.VITEST_MODE || process.env.NODE_ENV || 'test';
const baseViteConfig = baseViteConfigFn({ mode, command: 'serve' }); // command might be 'build' or 'serve'

export default mergeConfig(
  baseViteConfig,
  defineVitestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts', '@testing-library/jest-dom'],
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
