import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types.ts', // type definitions
        '**/index.ts', // Re-exports
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        // Stricter for core utilities
        'packages/authn-core/src/utils/': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95,
        },
        // Stricter for main hook
        'packages/authn-core/src/hooks/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@authn/core': './packages/authn-core/src',
    },
  },
  esbuild: {
    target: 'es2020',
    jsx: 'automatic',
  },
})
