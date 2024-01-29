import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
      globals: true,
      testTimeout: 100000,
      hookTimeout: 100000,
      restoreMocks: true,
      clearMocks: true,
      watch: false,
      silent: true,
      reporters: ["default", "vitest-markdown-reporter"],
      outputFile: {
        markdown: "test-report.md",
      },
      minThreads: process.env.CI ? 1 : 4,
      maxThreads: process.env.CI ? 1 : 8,
  },
})
