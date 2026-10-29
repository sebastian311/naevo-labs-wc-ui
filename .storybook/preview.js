import { setCustomElementsManifest } from '@storybook/web-components-vite';
import customElements from '../custom-elements.json' with { type: 'json' };

// Feed the Custom Elements Manifest to Storybook → auto-generated controls & docs tables
setCustomElementsManifest(customElements);

/** @type {import('@storybook/web-components-vite').Preview} */
export default {
  tags: ['autodocs'],
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
      },
    },
    a11y: {
      // 'todo' shows violations in the panel; switch to 'error' to fail story tests on violations
      test: 'todo',
    },
  },
};
