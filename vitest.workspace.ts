// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config'
import path from 'path'
export default defineWorkspace([
  {
    test: {
      // an example of file based convention,
      // you don't have to follow it
      environment: 'jsdom',
      globals: true,
      include: [
        'tests/unitTest/**/*.{test,spec}.tsx',
        'tests/**/*.unit.{test,spec}.tsx',
      ],
      name: 'unit',

      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
      },
    },
  },
  {
    test: {
      // an example of file based convention,
      // you don't have to follow it
      include: [
        'tests/browser/**/*.{test,spec}.ts',
        'tests/**/*.browser.{test,spec}.ts',
      ],
      name: 'browser',
      browser: {
        enabled: true,
        name: 'chrome',
      },
    },
  },
])
