import { html, fixture, expect } from '@open-wc/testing';
import '../naevo-input.js';

describe('naevo-input', () => {
  it('renders', async () => {
    const el = await fixture(html`<naevo-input></naevo-input>`);
    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });

  it('renders the input disabled', async () => {
    const el = await fixture(html`<naevo-input disabled></naevo-input>`);
    expect(el.disabled).to.be.true;
  });

  it('renders the input with required value validator', async () => {
    const el = await fixture(html`<naevo-input required></naevo-input>`);
    expect(el.required).to.be.true;
  });
});

describe('naevo-input directives and functionalities', () => {
  it('renders the label correctly', async () => {
    const el = await fixture(html`<naevo-input label="myLabel123"></naevo-input>`);

    const labelEl = el.shadowRoot.querySelector('label');
    expect(labelEl.textContent.trim()).to.equal('myLabel123');
  });

  it('renders the helperText correctly', async () => {
    const el = await fixture(html`<naevo-input helperText="myHelperText123"></naevo-input>`);

    const helperTextEl = el.shadowRoot.querySelector('.helper-text');
    expect(helperTextEl.textContent.trim()).to.equal('myHelperText123');
  });

  it('renders the placeholder correctly', async () => {
    const el = await fixture(html`<naevo-input placeholder="myPlaceholder123"></naevo-input>`);

    const placeHolderEl = el.shadowRoot.querySelector('input');
    expect(placeHolderEl.placeholder).to.be.equal('myPlaceholder123');
  });
});

describe('naevo-input types and patterns', () => {
  it('renders naevo-input email', async () => {
    const el = await fixture(html`<naevo-input type="email"></naevo-input>`);
    const input = el.shadowRoot.querySelector('input');

    input.value = '12345';
    input.dispatchEvent(new Event('input'));

    expect(el._isValid).to.be.false;
  });

  it('renders naevo-input number', async () => {
    const el = await fixture(html`<naevo-input type="number"></naevo-input>`);
    const input = el.shadowRoot.querySelector('input');

    input.value = 'abcdefg';
    input.dispatchEvent(new Event('input'));

    expect(el.value).to.be.equal('');
  });

  it('renders naevo-input password', async () => {
    const el = await fixture(html`<naevo-input type="password"></naevo-input>`);
    const input = el.shadowRoot.querySelector('input');

    expect(input.type).to.equal('password');
  });
});
