import { html, fixture, expect } from '@open-wc/testing';
import '../naevo-dropdown.js';

describe('naevo-dropdown', () => {
  it('renders', async () => {
    const el = await fixture(html`<naevo-dropdown></naevo-dropdown>`);
    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });
});
