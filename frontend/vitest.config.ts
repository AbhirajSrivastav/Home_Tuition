import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'e2e',
      '**/*.spec.ts',
    ],
    include: ['**/__tests__/**/*.test.tsx', '**/__tests__/**/*.test.ts'],
  },
});
