import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: ['html', 'default'],
    coverage: {
      provider: 'istanbul',
      enabled: true,
      reporter: ['html', 'text'],
      include: [
        'packages/core/src/**',
      ],
    },
  },
})
