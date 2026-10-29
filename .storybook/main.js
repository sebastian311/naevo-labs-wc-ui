/**
 * Storybook — component showcase and living documentation.
 * Runs on its own Vite dev server, separate from @web/dev-server.
 * Stories live next to each component: src/<name>/stories/*.stories.js
 */
/** @type {import('@storybook/web-components-vite').StorybookConfig} */
export default {
  stories: ['../src/**/stories/**/*.mdx', '../src/**/stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};
