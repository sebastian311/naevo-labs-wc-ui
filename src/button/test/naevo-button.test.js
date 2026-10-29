import { html, fixture, expect } from '@open-wc/testing';
import '../naevo-button.js';

describe('naevo-button', () => {
  it('renders', async () => {
    const el = await fixture(html`<naevo-button>Default</naevo-button>`);
    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });

  it('renders secondary type button', async () => {
    const el = await fixture(html`<naevo-button secondary>Secondary</naevo-button>`);
    const button = el.shadowRoot.querySelector('button');
    const styles = getComputedStyle(button);

    expect(styles.backgroundColor).to.equal('rgba(0, 0, 0, 0)'); // transparent
    expect(styles.borderColor).to.equal('rgb(43, 89, 195)'); // transparent
  });

  it('renders tertiary type button', async () => {
    const el = await fixture(html`<naevo-button tertiary></naevo-button>`);
    const button = el.shadowRoot.querySelector('button');
    const styles = getComputedStyle(button);

    expect(styles.backgroundColor).to.equal('rgba(0, 0, 0, 0)'); // transparent
    expect(styles.color).to.include('211, 101, 130'); // #D36582 in rgb
  });

  it('renders button disabled', async () => {
    const el = await fixture(html`<naevo-button primary disabled>Disabled Button</naevo-button>`);
    const button = el.shadowRoot.querySelector('button');

    expect(button.disabled).to.be.true;
    expect(getComputedStyle(el)?.opacity).to.equal('0.5');

    let clicked = false;
    button.addEventListener('click', () => clicked = true);
    expect(clicked).to.be.false;
  });
});
