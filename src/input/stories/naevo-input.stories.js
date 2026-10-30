import { html } from 'lit';
import '../naevo-input.js';

export default {
  title: 'Input',
  component: 'naevo-input',
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'number', 'password'] },
    label: { control: 'text' },
    helperText: { control: 'text' },
    invalidMessage: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    // Hide the three properties - redundant in story
    _inputType: { table: { disable: true } },
    _hasPrefix: { table: { disable: true } },
    _hasSuffix: { table: { disable: true } },
  },
  args: {
    type: 'text',
    label: 'My label',
    helperText: 'This is a helper text.',
    invalidMessage: 'Invalid control message!',
    placeholder: 'My placeholder',
    disabled: false,
    required: true,
  },
};

export const Naevo_Input = {
  render: ({ type, label, helperText, placeholder, disabled, required, invalidMessage }) => html`
    <naevo-input
      type=${type}
      label=${label}
      helperText=${helperText}
      placeholder=${placeholder}
      invalidMessage=${invalidMessage}
      ?disabled=${disabled}
      ?required=${required}
    ></naevo-input>
  `,
};
