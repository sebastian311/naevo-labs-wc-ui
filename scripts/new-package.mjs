#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Scaffolds a new package under packages/<name>/, following the anatomy described
 * in docs/phase-0-report.md §2: src/ (source), test/ (WTR+Mocha+Chai), e2e/ (Playwright),
 * demo/ (served by the dev server), stories/ (Storybook).
 *
 * Usage:
 *   npm run new -- <name>        e.g. npm run new -- button
 *                                e.g. npm run new -- radio-group
 */

const root = resolve(fileURLToPath(import.meta.url), '../..');
const name = process.argv[2];

if (!name || name === '--help' || name === '-h') {
  console.log('Usage: npm run new -- <name>   e.g. npm run new -- button, npm run new -- radio-group');
  process.exit(name ? 0 : 1);
}

if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
  console.error(
    `"${name}" isn't a valid package name. Use lowercase kebab-case, e.g. "button" or "radio-group".`,
  );
  process.exit(1);
}

const pkgDir = resolve(root, 'packages', name);
if (existsSync(pkgDir)) {
  console.error(`packages/${name} already exists.`);
  process.exit(1);
}

const tag = `naevo-${name}`; // custom element names must contain a hyphen — this always does
const pkgName = `@naevo-labs/${name}`;
const className = `Naevo${name
  .split('-')
  .map(part => part[0].toUpperCase() + part.slice(1))
  .join('')}`;
const title = name
  .split('-')
  .map(part => part[0].toUpperCase() + part.slice(1))
  .join(' ');

const rootPkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const litVersion = rootPkg.devDependencies.lit;

const files = {
  'package.json': `${JSON.stringify(
    {
      name: pkgName,
      version: '0.0.0',
      type: 'module',
      main: './dist/index.js',
      module: './dist/index.js',
      exports: {
        '.': {
          source: './src/index.js',
          default: './dist/index.js',
        },
      },
      files: ['dist'],
      scripts: {
        build: 'rollup -c ../../rollup.config.mjs',
      },
      dependencies: {
        lit: litVersion,
      },
      publishConfig: {
        access: 'public',
      },
    },
    null,
    2,
  )}\n`,

  'src/index.js': `export { ${className} } from './${tag}.js';\n`,

  [`src/${tag}.js`]: `import { LitElement, html, css } from 'lit';

/**
 * @tag ${tag}
 * @summary TODO: describe ${tag}.
 * @slot - Default slot content.
 */
export class ${className} extends LitElement {
  static styles = css\`
    :host {
      display: block;
    }
  \`;

  static properties = {
    // TODO: declare reactive properties here
  };

  render() {
    return html\`<slot></slot>\`;
  }
}

customElements.define('${tag}', ${className});
`,

  [`test/${tag}.test.js`]: `import { html, fixture, expect } from '@open-wc/testing';
import '../src/${tag}.js';

describe('${tag}', () => {
  it('renders', async () => {
    const el = await fixture(html\`<${tag}></${tag}>\`);
    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });
});
`,

  [`e2e/${tag}.spec.js`]: `import { test, expect } from '@playwright/test';

test('${tag} demo renders', async ({ page }) => {
  await page.goto('/packages/${name}/demo/');
  await expect(page.locator('${tag}')).toBeVisible();
});
`,

  'demo/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${tag}</title>
  </head>
  <body>
    <${tag}>Hello from ${tag}</${tag}>
    <script type="module">
      import '${pkgName}';
    </script>
  </body>
</html>
`,

  [`stories/${tag}.stories.js`]: `import { html } from 'lit';
import '../src/${tag}.js';

export default {
  title: '${title}',
  component: '${tag}',
};

export const Default = {
  render: () => html\`<${tag}>Default</${tag}>\`,
};
`,
};

for (const [path, content] of Object.entries(files)) {
  const filePath = resolve(pkgDir, path);
  mkdirSync(resolve(filePath, '..'), { recursive: true });
  writeFileSync(filePath, content);
}

console.log(`Created packages/${name}/`);
console.log('Next steps:');
console.log('  1. npm install                         (links the new workspace)');
console.log(
  `  2. Link the demo in /index.html:         <li><a href="/packages/${name}/demo/">${tag}</a></li>`,
);
console.log(`  3. Build it in packages/${name}/src/${tag}.js`);
