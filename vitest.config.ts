import { env } from 'node:process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['html', 'default'],
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
