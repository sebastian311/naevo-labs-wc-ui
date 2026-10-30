import { LitElement, html, css } from 'lit';

/**
 * @tag naevo-button
 * @summary A versatile button component with primary, secondary, and tertiary variants.
 *
 * @slot - Default slot for button text content
 * @slot prefix - Content placed before the label (icons, badges)
 * @slot suffix - Content placed after the label (icons, arrows)
 *
 * @cssprop --naevo-button-radius - Border radius override
 * @cssprop --naevo-button-font-size - Font size override
 *
 * @attr {boolean} primary - Renders the primary (filled) variant
 * @attr {boolean} secondary - Renders the secondary (outlined) variant
 * @attr {boolean} tertiary - Renders the tertiary (ghost/text) variant
 * @attr {boolean} disabled - Disables the button
 */
export class NaevoButton extends LitElement {
  static properties = {
    primary: { type: Boolean, reflect: true },
    secondary: { type: Boolean, reflect: true },
    tertiary: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: var(--naevo-disabled-opacity, 0.5);
    }

    button {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--naevo-space-sm, 8px);
      box-sizing: border-box;

      padding: var(--naevo-space-sm, 8px) var(--naevo-space-md, 16px);
      border-radius: var(--naevo-button-radius, var(--naevo-radius-md, 8px));

      font-family: var(--naevo-font-family, system-ui, sans-serif);
      font-size: var(--naevo-button-font-size, var(--naevo-font-size-md, 1rem));
      font-weight: var(--naevo-font-weight-medium, 500);
      line-height: var(--naevo-line-height, 1.5);

      cursor: pointer;
      transition:
        background var(--naevo-transition-fast, 120ms ease),
        color var(--naevo-transition-fast, 120ms ease),
        box-shadow var(--naevo-transition-fast, 120ms ease),
        border-color var(--naevo-transition-fast, 120ms ease);

      /* Default = primary look (fallback when no variant attr is set) */
      background: var(--naevo-color-primary, #33ced0);
      color: var(--naevo-color-gray-900, #171717);
      border: 2px solid transparent;
    }

    button:hover {
      background: var(--naevo-color-primary-dark, #28a5a7);
    }

    button:active {
      background: var(--naevo-color-primary-darkest, #1d7a7b);
    }

    button:focus-visible {
      box-shadow: var(--naevo-focus-ring, 0 0 0 3px rgba(51, 206, 208, 0.4));
    }

    /* ── Primary (explicit) ───────────────────────────────── */
    :host([primary]) button {
      background: var(--naevo-color-primary, #33ced0);
      color: var(--naevo-color-gray-900, #171717);
    }

    :host([primary]) button:hover {
      background: var(--naevo-color-primary-dark, #28a5a7);
    }

    :host([primary]) button:active {
      background: var(--naevo-color-primary-darkest, #1d7a7b);
    }

    /* ── Secondary (outlined) ─────────────────────────────── */
    :host([secondary]) button {
      background: transparent;
      color: var(--naevo-color-secondary, #2b59c3);
      border-color: var(--naevo-color-secondary, #2b59c3);
    }

    :host([secondary]) button:hover {
      background: var(--naevo-color-secondary-lightest, #dce3f3);
    }

    :host([secondary]) button:active {
      background: var(--naevo-color-secondary-light, #6b8ad8);
      color: var(--naevo-color-gray-900, #171717);
    }

    /* ── Tertiary (ghost / text) ──────────────────────────── */
    :host([tertiary]) button {
      background: transparent;
      color: var(--naevo-color-accent, #d36582);
      border-color: transparent;
      padding-inline: var(--naevo-space-sm, 8px);
    }

    :host([tertiary]) button:hover {
      background: var(--naevo-color-accent-lightest, #f5dce3);
    }

    :host([tertiary]) button:active {
      background: var(--naevo-color-accent-light, #e49aae);
      color: var(--naevo-color-gray-900, #171717);
    }

    /* ── Slots ────────────────────────────────────────────── */
    ::slotted([slot='prefix']),
    ::slotted([slot='suffix']) {
      display: flex;
      align-items: center;
      width: 1.2em;
      height: 1.2em;
    }
  `;

  constructor() {
    super();
    this.primary = false;
    this.secondary = false;
    this.tertiary = false;
    this.disabled = false;
  }

  updated(changedProperties) {
    const variantChanged =
      changedProperties.has('primary') ||
      changedProperties.has('secondary') ||
      changedProperties.has('tertiary');

    if (variantChanged) {
      const count = [this.primary, this.secondary, this.tertiary].filter(Boolean).length;
      if (count > 1) {
        console.warn(
          `<naevo-button>: Only one variant attribute should be set. Got ${count}. Using first match.`,
        );
      }
    }
  }

  render() {
    return html`
      <button ?disabled=${this.disabled} aria-disabled=${this.disabled}>
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
      </button>
    `;
  }
}

customElements.define('naevo-button', NaevoButton);
