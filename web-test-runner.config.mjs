import { playwrightLauncher } from '@web/test-runner-playwright';

/**
 * @web/test-runner — unit / component tests.
 * Runs Mocha test files inside real browsers (launched by Playwright),
 * using the same native-ESM pipeline as @web/dev-server.
 * Tests live next to each component: src/<name>/test/*.test.js
 */
export default {
  files: 'src/**/test/**/*.test.js',
  nodeResolve: {
    exportConditions: ['development'],
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
    include: ['src/**/*.js'],
    exclude: ['src/**/{test,stories,e2e,demo}/**'],
    reportDir: 'coverage',
  },
  // Silence the one-time "Lit is in dev mode" banner; keep every other warning
  filterBrowserLogs: ({ args }) => !String(args[0]).includes('Lit is in dev mode'),
};
