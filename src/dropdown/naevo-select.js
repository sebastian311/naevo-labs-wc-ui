import { LitElement, html, css } from 'lit';
/**
 * @typedef {{ value: string, label: string }} NaevoSelectOption
 */

/**
 * @tag naevo-select
 * @summary A versatile select component with keyboard navigation and accessibility support.
 *
 * @attr {string} label - Visible label above the select
 * @attr {string} placeholder - Placeholder text shown when nothing is selected
 * @attr {string} value - The selected option's value
 * @prop {NaevoSelectOption[]} options - Options displayed in the options panel
 * @attr {boolean} disabled - Disables the select
 * @attr {boolean} required - Marks the select as required
 *
 * @fires naevo-select - Fired when an option is selected. `detail: { value }`
 */
export class NaevoSelect extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--naevo-font-family, system-ui, sans-serif);
      position: relative;
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: var(--naevo-disabled-opacity, 0.5);
    }

    label {
      display: block;
      margin-bottom: var(--naevo-space-xs, 4px);
      font-size: var(--naevo-font-size-sm, 0.875rem);
      font-weight: var(--naevo-font-weight-medium, 500);
      color: var(--naevo-color-gray-700, #404040);
    }

    .required-marker {
      color: var(--naevo-color-error, #dc2626);
      margin-left: 2px;
    }

    .select-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 2px solid var(--naevo-color-gray-300, #d4d4d4);
      border-radius: var(--naevo-input-radius, var(--naevo-radius-md, 8px));
      background: var(--naevo-color-white, #fff);
      padding: var(--naevo-space-sm, 8px) var(--naevo-space-md, 16px);
      cursor: pointer;
      transition:
        border-color var(--naevo-transition-fast, 120ms ease),
        box-shadow var(--naevo-transition-fast, 120ms ease);
    }

    .select-wrapper:focus-within {
      border-color: var(--naevo-color-primary, #33ced0);
      box-shadow: var(--naevo-focus-ring, 0 0 0 3px rgba(51, 206, 208, 0.4));
    }

    .select-value {
      font-size: var(--naevo-input-font-size, var(--naevo-font-size-md, 1rem));
      color: var(--naevo-color-gray-900, #171717);
    }

    .select-value.placeholder {
      color: var(--naevo-color-gray-500, #737373);
    }

    .arrow {
      font-size: 0.75rem;
      color: var(--naevo-color-gray-500, #737373);
    }

    .options-panel {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin: var(--naevo-space-xs, 4px) 0 0 0;
      padding: var(--naevo-space-xs, 4px) 0;
      list-style: none;
      background: var(--naevo-color-white, #fff);
      border: 2px solid var(--naevo-color-gray-300, #d4d4d4);
      border-radius: var(--naevo-input-radius, var(--naevo-radius-md, 8px));
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 100;
      max-height: 200px;
      overflow-y: auto;
    }

    .option {
      padding: var(--naevo-space-sm, 8px) var(--naevo-space-md, 16px);
      cursor: pointer;
      font-size: var(--naevo-input-font-size, var(--naevo-font-size-md, 1rem));
      color: var(--naevo-color-gray-900, #171717);
    }

    .option:hover,
    .option.active {
      background: var(--naevo-color-gray-100, #f5f5f5);
    }

    .option.selected {
      color: var(--naevo-color-primary, #33ced0);
      font-weight: var(--naevo-font-weight-medium, 500);
    }
  `;

  static properties = {
    _open: { type: Boolean, state: true },
    label: { type: String },
    placeholder: { type: String },
    value: { type: String },
    options: { type: Array },
    disabled: { type: Boolean },
    required: { type: Boolean },
    _touched: { type: Boolean, state: true },
    _isValid: { type: Boolean, state: true },
    _activeIndex: { type: Number, state: true },
  };

  constructor() {
    super();

    // State
    this._open = false;
    this._touched = false;
    this._isValid = true;
    this._activeIndex = null;

    // Properties
    this.label = '';
    this.placeholder = '';
    this.value = '';
    /** @type {Array<{value: string, label: string}>} */
    this.options = [];
    this.disabled = false;
    this.required = false;
  }

  _onKeydown(e) {
    if (!this.options.length) return;

    const last = this.options.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); // stops the page from scrolling
        if (!this._open) {
          this._open = true;
          this._activeIndex = 0;
        } else {
          this._activeIndex = this._activeIndex < last ? this._activeIndex + 1 : 0;
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!this._open) {
          this._open = true;
          this._activeIndex = 0;
        } else {
          this._activeIndex = this._activeIndex > 0 ? this._activeIndex - 1 : last;
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (!this._open) {
          this._open = true;
          this._activeIndex = 0;
        } else if (this._activeIndex !== null) {
          this._onSelect(this.options[this._activeIndex]);
        }
        break;

      case 'Escape':
        if (this._open) {
          this._open = false;
          this._activeIndex = null;
        }
        break;
    }
  }

  _onBlur() {
    this._open = false;
    this._activeIndex = null;
  }

  _onClick() {
    this._touched = true;
    this._open = !this._open;
  }

  _onSelect(opt) {
    this.value = opt.value;
    this._open = false;

    if (this.required) this._isValid = true;

    this.dispatchEvent(
      new CustomEvent('naevo-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const selectedOption = this.options.find(opt => opt.value === this.value);

    return html`
      ${
        this.label
          ? html`
              <label id="label">
                ${this.label}${this.required ? html`<span class="required-marker">*</span>` : ''}
              </label>
            `
          : ''
      }

      <div
        class="select-wrapper"
        tabindex=${this.disabled ? '-1' : '0'}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded=${this._open ? 'true' : 'false'}
        aria-controls="listbox"
        aria-labelledby=${this.label ? 'label' : ''}
        aria-required=${this.required ? 'true' : 'false'}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-activedescendant=${this._open && this._activeIndex !== null ? `option-${this._activeIndex}` : ''}
        @click=${this._onClick}
        @keydown=${this._onKeydown}
        @blur=${this._onBlur}
      >
        <span class="select-value ${!selectedOption ? 'placeholder' : ''}">
          ${selectedOption ? selectedOption.label : this.placeholder || 'Select...'}
        </span>
        <span class="arrow">${this._open ? '▲' : '▼'}</span>
      </div>

      ${
        this._open
          ? html`
              <ul
                id="listbox"
                class="options-panel"
                role="listbox"
                aria-labelledby=${this.label ? 'label' : ''}
                @mousedown=${e => e.preventDefault()}
              >
                ${this.options.map(
                  (opt, i) => html`
                    <li
                      id="option-${i}"
                      class="option ${this.value === opt.value ? 'selected' : ''} ${this._activeIndex === i ? 'active' : ''}"
                      role="option"
                      aria-selected=${this.value === opt.value ? 'true' : 'false'}
                      @click=${() => this._onSelect(opt)}
                    >
                      ${opt.label}
                    </li>
                  `,
                )}
              </ul>
            `
          : ''
      }
    `;
  }
}

customElements.define('naevo-select', NaevoSelect);
