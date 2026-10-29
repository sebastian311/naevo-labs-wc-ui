/**
 * @web/dev-server — local development.
 * Serves the repo root as native ES modules: no bundling, no build step.
 * The only transform is rewriting bare imports ("lit") to real paths ("/node_modules/lit/index.js").
 *
 * Demo pages live at /src/<name>/demo/index.html and are linked from /index.html.
 */
export default {
  rootDir: '.',
  // Reload the browser on file changes
  watch: true,
  nodeResolve: {
    // "development" → Lit's dev build, which emits helpful warnings
    exportConditions: ['development'],
  },
};
