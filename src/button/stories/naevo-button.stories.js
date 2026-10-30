import { html } from 'lit';
import '../naevo-button.js';

export default {
  title: 'Button',
  component: 'naevo-button',
  argTypes: {
    primary: { control: 'boolean' },
    secondary: { control: 'boolean' },
    tertiary: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    primary: true,
    secondary: false,
    tertiary: false,
    disabled: false,
  },
};

export const Button = {
  render: ({ primary, secondary, tertiary, disabled }) => html`
    <naevo-button ?disabled=${disabled} ?primary=${primary} ?secondary=${secondary} ?tertiary=${tertiary}>
      Button-Text
    </naevo-button>
  `,
};

export const Suffix_Button = {
  render: ({ primary }) => html`
    <naevo-button primary ?primary=${primary}>
      Save
      <span slot="suffix">→</span>
    </naevo-button>
  `,
};
