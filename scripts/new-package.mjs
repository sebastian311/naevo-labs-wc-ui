#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Scaffolds a new component under src/<name>/:
 *   index.js          public entry → published as '<package>/<name>' via the "./*" export
 *   naevo-<name>.js   the element
 *   test/             unit tests (WTR + Mocha + Chai)
 *   e2e/              behavioural tests (Playwright)
 *   demo/             HTML demo page (served by the dev server)
 *   stories/          Storybook stories
 *
 * Usage:
 *   npm run new -- <name>        e.g. npm run new -- button
 *                                e.g. npm run new -- radio-group
 */

const root = resolve(fileURLToPath(import.meta.url), '../..');
const name = process.argv[2];
const reserved = ['styles'];

if (!name || name === '--help' || name === '-h') {
  console.log('Usage: npm run new -- <name>   e.g. npm run new -- button, npm run new -- radio-group');
  process.exit(name ? 0 : 1);
}

if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name) || reserved.includes(name)) {
  console.error(
    `"${name}" isn't a valid component name. Use lowercase kebab-case, e.g. "button" or "radio-group" (not: ${reserved.join(', ')}).`,
  );
  process.exit(1);
}

const componentDir = resolve(root, 'src', name);
if (existsSync(componentDir)) {
  console.error(`src/${name} already exists.`);
  process.exit(1);
}

const tag = `naevo-${name}`; // custom element names must contain a hyphen — this always does
const className = `Naevo${name
  .split('-')
  .map(part => part[0].toUpperCase() + part.slice(1))
  .join('')}`;
const title = name
  .split('-')
  .map(part => part[0].toUpperCase() + part.slice(1))
  .join(' ');

const { name: pkgName } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

const files = {
  'index.js': `export { ${className} } from './${tag}.js';\n`,

  [`${tag}.js`]: `import { LitElement, html, css } from 'lit';

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
import '../${tag}.js';

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
  await page.goto('/src/${name}/demo/');
  await expect(page.locator('${tag}')).toBeVisible();
});
`,

  'demo/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${tag}</title>
    <link rel="stylesheet" href="/src/styles/tokens.css" />
  </head>
  <body>
    <${tag}>Hello from ${tag}</${tag}>
    <script type="module" src="/src/${name}/index.js"></script>
  </body>
</html>
`,

  [`stories/${tag}.stories.js`]: `import { html } from 'lit';
import '../${tag}.js';

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
  const filePath = resolve(componentDir, path);
  mkdirSync(resolve(filePath, '..'), { recursive: true });
  writeFileSync(filePath, content);
}

console.log(`Created src/${name}/  →  consumers: import { ${className} } from '${pkgName}/${name}';`);
console.log('Next steps:');
console.log(`  1. Link the demo in /index.html:   <li><a href="/src/${name}/demo/">${tag}</a></li>`);
console.log(`  2. Build it in src/${name}/${tag}.js`);
