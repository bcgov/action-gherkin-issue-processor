/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    mockReset: true,
    coverage: {
      provider: 'istanbul',
      all: true,
      clean: true,
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['src/**/*.ts'],
      exclude: ['node_modules', 'dist', 'coverage', 'badges']
    }
  }
})
