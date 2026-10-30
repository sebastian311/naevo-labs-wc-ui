import { LitElement, html, css } from 'lit';

/**
 * @tag naevo-input
 * @summary A versatile input component with text, email, number, and password variants.
 *
 * @slot prefix - Content placed before the input (e.g., icon or button)
 * @slot suffix - Content placed after the input (e.g., search button)
 *
 * @cssprop --naevo-input-radius - Border radius override
 * @cssprop --naevo-input-font-size - Font size override
 *
 * @attr {string} type - The input variant: text | email | number | password
 * @attr {string} label - Visible label above the input
 * @attr {string} helperText - Helper text shown below the input
 * @attr {string} placeholder - Placeholder text inside the input
 * @attr {boolean} disabled - Disables the input
 * @attr {boolean} required - Marks the input as required
 */

const TYPES = Object.freeze({
  TEXT: 'text',
  NUM: 'number',
  EMAIL: 'email',
  PASS: 'password',
});

export class NaevoInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: var(--naevo-font-family, system-ui, sans-serif);
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: var(--naevo-disabled-opacity, 0.5);
    }

    /* ── Label ────────────────────────────────────────────── */
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

    .input-wrapper {
      display: flex;
      align-items: center;
      border: 2px solid var(--naevo-color-gray-300, #d4d4d4);
      border-radius: var(--naevo-input-radius, var(--naevo-radius-md, 8px));
      background: var(--naevo-color-white, #fff);
      transition:
        border-color var(--naevo-transition-fast, 120ms ease),
        box-shadow var(--naevo-transition-fast, 120ms ease);
      overflow: hidden;
    }

    .input-wrapper:focus-within {
      border-color: var(--naevo-color-primary, #33ced0);
      box-shadow: var(--naevo-focus-ring, 0 0 0 3px rgba(51, 206, 208, 0.4));
    }

    .input-wrapper--invalid {
      border-color: var(--naevo-color-error, #dc2626);
    }

    .input-wrapper--invalid:focus-within {
      border-color: var(--naevo-color-error, #dc2626);
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.3);
    }

    input {
      all: unset;
      flex: 1;
      min-width: 0;
      padding: var(--naevo-space-sm, 8px) var(--naevo-space-md, 16px);
      font-family: inherit;
      font-size: var(--naevo-input-font-size, var(--naevo-font-size-md, 1rem));
      line-height: var(--naevo-line-height, 1.5);
      color: var(--naevo-color-gray-900, #171717);
    }

    input::placeholder {
      color: var(--naevo-color-gray-400, #a3a3a3);
    }

    /* ── Prefix / Suffix Slots ─────────────────────────────────── */
    .prefix,
    .suffix {
      display: flex;
      align-items: center;
      color: var(--naevo-color-gray-500, #737373);
    }

    .prefix {
      padding-left: var(--naevo-space-sm, 8px);
    }

    .suffix {
      padding-right: var(--naevo-space-sm, 8px);
    }

    .has-prefix input {
      padding-left: var(--naevo-space-xs, 4px);
    }

    .has-suffix input {
      padding-right: var(--naevo-space-xs, 4px);
    }

    .helper-text {
      margin-top: var(--naevo-space-xs, 4px);
      font-size: var(--naevo-font-size-sm, 0.875rem);
      color: var(--naevo-color-gray-500, #737373);
    }

    .helper-text--invalid {
      color: var(--naevo-color-error, #dc2626);
    }
  `;

  static properties = {
    type: { type: String },
    label: { type: String },
    helperText: { type: String },
    placeholder: { type: String },
    invalidMessage: { type: String },
    value: { type: String },
    required: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    _isValid: { type: Boolean, state: true },
    _touched: { type: Boolean, state: true },
  };

  /** @type {'text'|'number'|'email'|'password'} */
  get _inputType() {
    return Object.values(TYPES).includes(this.type) ? this.type : 'text';
  }

  get _hasPrefix() {
    return this.querySelector('[slot="prefix"]') !== null;
  }

  get _hasSuffix() {
    return this.querySelector('[slot="suffix"]') !== null;
  }

  constructor() {
    super();
    this.type = 'text';
    this.label = '';
    this.helperText = '';
    this.placeholder = '';
    this.invalidMessage = '';
    this.disabled = false;
    this.required = false;
    this.value = '';
    this._isValid = true;
    this._touched = false;
  }

  _onInput(e) {
    this._touched = true;
    this.value = e.target.value;
    this._validate();
    this.dispatchEvent(
      new CustomEvent('naevo-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _validate() {
    const input = this.shadowRoot.querySelector('input');
    this._isValid = input.checkValidity();
  }

  render() {
    const wrapperClasses = [
      'input-wrapper',
      !this._isValid && this._touched ? 'input-wrapper--invalid' : '',
      this._hasPrefix ? 'has-prefix' : '',
      this._hasSuffix ? 'has-suffix' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      ${
        this.label
          ? html`
              <label for="input">
                ${this.label}${this.required ? html`<span class="required-marker">*</span>` : ''}
              </label>
            `
          : ''
      }

      <div class="${wrapperClasses}">
        ${this._hasPrefix ? html`<div class="prefix"><slot name="prefix"></slot></div>` : ''}

        <input
          id="input"
          aria-label=${this.label || this.placeholder || 'Input'}
          type=${this._inputType}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          .value=${this.value}
          @input=${this._onInput}
        />

        ${this._hasSuffix ? html`<div class="suffix"><slot name="suffix"></slot></div>` : ''}
      </div>

      ${
        this.helperText
          ? html`
              <div class="helper-text ${!this._isValid && this._touched ? 'helper-text--invalid' : ''}">
                ${!this._isValid && this._touched ? this.invalidMessage || 'Invalid input' : this.helperText}
              </div>
            `
          : html`${!this._isValid && this._touched ? this.invalidMessage || 'Invalid input' : ''}`
      }
    `;
  }
}

customElements.define('naevo-input', NaevoInput);
