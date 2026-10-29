/**
 * @web/dev-server — local development.
 * Serves the repo root as native ES modules: no bundling, no build step.
 * The only transform is rewriting bare imports ("lit") to real paths ("/node_modules/lit/index.js").
 *
 * Demo pages live at /packages/<name>/demo/index.html and are linked from /index.html.
 */
export default {
  rootDir: '.',
  // Reload the browser on file changes
  watch: true,
  nodeResolve: {
    // "source" → our own packages resolve to src/ instead of dist/ (see docs/phase-0-report.md §2)
    // "development" → Lit's dev build, which emits helpful warnings
    exportConditions: ['source', 'development'],
  },
};
