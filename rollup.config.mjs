import { readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

/**
 * Rollup — release builds only (dev and tests never touch this).
 * Shared by every package: each package runs `rollup -c ../../rollup.config.mjs`,
 * so process.cwd() is the package being built.
 *
 * Two outputs per package:
 *  1. dist/*.js               — ESM, one file per source module, dependencies (lit) left external.
 *                               For consumers with a bundler: npm dedupes lit, tree-shaking works.
 *  2. dist/<name>.bundled.js  — single minified file with lit inlined.
 *                               For no-build consumers: a <script type="module"> in a CMS, intranet page, etc.
 */
const pkg = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));
const bundleName = pkg.name.split('/').pop();

const externalDeps = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})];
const isExternal = id => externalDeps.some(dep => id === dep || id.startsWith(`${dep}/`));

// Start every release from a clean dist/
rmSync(resolve(process.cwd(), 'dist'), { recursive: true, force: true });

// "source" lets the standalone bundle pull sibling @naevo-labs packages from src/, so build order doesn't matter
const resolvePlugin = () => nodeResolve({ exportConditions: ['source'] });

export default [
  {
    input: 'src/index.js',
    external: isExternal,
    plugins: [resolvePlugin()],
    output: {
      dir: 'dist',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
  },
  {
    input: 'src/index.js',
    plugins: [resolvePlugin(), terser({ format: { comments: false } })],
    output: {
      file: `dist/${bundleName}.bundled.js`,
      format: 'es',
      sourcemap: true,
    },
  },
];
