/**
 * Custom Elements Manifest analyzer — reads component source and writes custom-elements.json:
 * a standard, machine-readable description of every element (tag, properties, attributes, events, slots, CSS parts).
 * Storybook reads it to auto-generate controls and docs tables.
 */
export default {
  globs: ['packages/*/src/**/*.js'],
  exclude: ['**/*.test.js', '**/*.stories.js'],
  outdir: '.',
  litelement: true,
};
