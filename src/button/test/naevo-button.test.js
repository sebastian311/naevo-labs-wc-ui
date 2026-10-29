import { html, fixture, expect } from '@open-wc/testing';
import '../naevo-button.js';

describe('naevo-button', () => {
  it('renders', async () => {
    const el = await fixture(html`<naevo-button></naevo-button>`);
    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });
});
