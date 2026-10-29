import { html, fixture, expect } from '@open-wc/testing';
import '../naevo-input.js';

describe('naevo-input', () => {
  it('renders', async () => {
    const el = await fixture(html`<naevo-input></naevo-input>`);
    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });
});
