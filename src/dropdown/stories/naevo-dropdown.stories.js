import { html } from 'lit';
import '../naevo-select.js';

export default {
  title: 'Dropdown',
  component: 'naevo-select',
  decorators: [story => html`<div style="height: 16rem !important;">${story()}</div>`],
  argTypes: {
    value: { control: 'text' },
    options: { control: 'array' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    // Hide the three properties - redundant in story
    _open: { table: { disable: true } },
    _touched: { table: { disable: true } },
    _activeIndex: { table: { disable: true } },
  },
  args: {
    value: '',
    // options: ['Apple', 'Pear', 'Banana'],
    options: [
      {
        value: 'A',
        label: 'Apple',
      },
      {
        value: 'P',
        label: 'Pear',
      },
      {
        value: 'B',
        label: 'Banana',
      },
    ],
    label: 'My dropdown label',
    placeholder: 'My placeholder',
    disabled: false,
    required: true,
  },
};

export const Default = {
  render: ({ value, options, label, placeholder, disabled, required }) => html`
    <naevo-select
      value=${value}
      .options=${options}
      label=${label}
      placeholder=${placeholder}
      .disabled=${disabled}
      .required=${required}
      >Default
    </naevo-select>
  `,
};
