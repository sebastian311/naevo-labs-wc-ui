/**
 * Storybook — component showcase and living documentation.
 * Runs on its own Vite dev server, separate from @web/dev-server.
 * Stories live next to each component: packages/<name>/stories/*.stories.js
 */
/** @type {import('@storybook/web-components-vite').StorybookConfig} */
export default {
  stories: ['../packages/*/stories/**/*.mdx', '../packages/*/stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(config) {
    const { defaultClientConditions } = await import('vite');
    // Resolve @naevo-labs/* from src/ (same "source" condition as dev-server and test-runner), no prior build needed
    config.resolve ??= {};
    config.resolve.conditions = ['source', ...defaultClientConditions];
    return config;
  },
};
