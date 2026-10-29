/**
 * Custom Elements Manifest analyzer — reads component source and writes custom-elements.json:
 * a standard, machine-readable description of every element (tag, properties, attributes, events, slots, CSS parts).
 * Storybook reads it to auto-generate controls and docs tables; it also ships in the npm package
 * ("customElements" field in package.json) for IDEs and other tooling.
 */
export default {
  globs: ['src/**/*.js'],
  exclude: ['src/**/{test,stories,e2e,demo}/**'],
  outdir: '.',
  litelement: true,
};
