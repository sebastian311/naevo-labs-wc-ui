import { readdirSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

/**
 * Rollup — release builds only (dev and tests never touch this).
 *
 * Every folder in src/ with an index.js is a component entry point, published as a subpath:
 *   src/button/index.js  →  dist/button/index.js  →  import { NaevoButton } from 'naevo-ui/button'
 * (mapped by the "./*" pattern in package.json "exports").
 *
 * Two outputs:
 *  1. dist/<name>/*.js        — ESM, one file per source module, lit left external.
 *                               For consumers with a bundler: npm dedupes lit, tree-shaking works.
 *  2. dist/naevo-ui.bundled.js — every component in one minified file with lit inlined.
 *                               For no-build consumers: a <script type="module"> in a CMS, intranet page, etc.
 *
 * Plus src/styles/*.css copied as-is to dist/styles/ (tokens.css → 'naevo-ui/tokens.css').
 */
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const bundleName = pkg.name.split('/').pop();

const componentEntries = readdirSync('src', { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(`src/${entry.name}/index.js`))
  .map(entry => `src/${entry.name}/index.js`);

if (componentEntries.length === 0) {
  throw new Error('No components to build: expected at least one src/<name>/index.js');
}

const externalDeps = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})];
const isExternal = id => externalDeps.some(dep => id === dep || id.startsWith(`${dep}/`));

// Start every release from a clean dist/
rmSync('dist', { recursive: true, force: true });

// Emits src/styles/*.css into dist/styles/ untouched
const copyStyles = () => ({
  name: 'naevo-copy-styles',
  generateBundle() {
    for (const file of readdirSync('src/styles').filter(name => name.endsWith('.css'))) {
      this.emitFile({
        type: 'asset',
        fileName: `styles/${file}`,
        source: readFileSync(`src/styles/${file}`),
      });
    }
  },
});

// Virtual entry re-exporting every component, so the standalone bundle needs no hand-maintained index
const ALL_COMPONENTS = '\0naevo-all-components';
const allComponents = () => ({
  name: 'naevo-all-components',
  resolveId: id => (id === ALL_COMPONENTS ? id : null),
  load: id =>
    id === ALL_COMPONENTS
      ? componentEntries.map(entry => `export * from ${JSON.stringify(resolve(entry))};`).join('\n')
      : null,
});

export default [
  {
    input: componentEntries,
    external: isExternal,
    plugins: [nodeResolve(), copyStyles()],
    output: {
      dir: 'dist',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
  },
  {
    input: ALL_COMPONENTS,
    plugins: [allComponents(), nodeResolve(), terser({ format: { comments: false } })],
    output: {
      file: `dist/${bundleName}.bundled.js`,
      format: 'es',
      sourcemap: true,
    },
  },
];
