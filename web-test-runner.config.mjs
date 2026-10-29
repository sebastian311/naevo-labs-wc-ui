import { playwrightLauncher } from '@web/test-runner-playwright';

/**
 * @web/test-runner — unit / component tests.
 * Runs Mocha test files inside real browsers (launched by Playwright),
 * using the same native-ESM pipeline as @web/dev-server.
 */
export default {
  files: 'packages/*/test/**/*.test.js',
  nodeResolve: {
    exportConditions: ['source', 'development'],
  },
  browsers: [playwrightLauncher({ product: 'chromium' }), playwrightLauncher({ product: 'firefox' })],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 3000,
    },
  },
  // Only collected with `npm run test:coverage` (V8 coverage → Chromium only)
  coverageConfig: {
    include: ['packages/*/src/**/*.js'],
    reportDir: 'coverage',
  },
  // Silence the one-time "Lit is in dev mode" banner; keep every other warning
  filterBrowserLogs: ({ args }) => !String(args[0]).includes('Lit is in dev mode'),
};
