// Global TypeScript suppressions for development builds
// This file suppresses build warnings to allow rapid prototyping

declare global {
  // Suppress unused variable warnings globally in development
  namespace NodeJS {
    interface ProcessEnv {
      VITE_SKIP_TS_CHECK?: string;
    }
  }
}

export {};