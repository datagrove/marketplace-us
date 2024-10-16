// vitest.workspace.ts
import solidPlugin from "vite-plugin-solid"
import { defineWorkspace } from 'vitest/config'
import path from 'path'

export default defineWorkspace([

  {
    plugins: [solidPlugin()],
    test: {
      // an example of file based convention,
      // you don't have to follow it

      name: 'Unit',
      environment: 'jsdom',
      globals: true,
      include: [
        'tests/unitTest/**/*.{test,spec}.tsx',
        'tests/**/*.unitTest.{test,spec}.tsx',
      ],

      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
      },
    },
  },
  {
    test: {
      // an example of file based convention,
      // you don't have to follow it
      name: 'End to End',
      include: [
        'tests/e2e/**/*.{test,spec}.js',
        'tests/**/*.e2e.{test,spec}.js',
      ],
      browser: {
        enabled: true,
        name: 'chrome',
      },
    },
  },
])
