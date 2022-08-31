import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'build/*'],
    reporters: 'verbose',
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      provider: 'c8', // or 'istanbul'
      all: true,
    },
  },
})