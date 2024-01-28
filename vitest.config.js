import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
      globals: true,
      testTimeout: 100000,
      hookTimeout: 100000,
      restoreMocks: true,
      clearMocks: true,
      watch: false,
      setupFiles: ['src/testSetup.js'],
  },
})
