import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import '../naevo-select.js'; // adjust path to match your repo

const OPTIONS = [
  { value: 'apple', label: 'Apples' },
  { value: 'pear', label: 'Pears' },
  { value: 'banana', label: 'Bananas' },
];

const getTrigger = (el) => el.shadowRoot.querySelector('.select-wrapper');
const getListbox = (el) => el.shadowRoot.querySelector('[role="listbox"]');
const getOptions = (el) => el.shadowRoot.querySelectorAll('[role="option"]');

const press = async (el, key) => {
  getTrigger(el).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true }));
  await el.updateComplete;
};

const createSelect = () =>
  fixture(html`<naevo-select label="Fruit" .options=${OPTIONS}></naevo-select>`);

describe('naevo-select', () => {
  // ---------- Rendering ----------

  it('renders default placeholder when nothing is selected', async () => {
    const el = await createSelect();
    expect(el.shadowRoot.querySelector('.select-value').textContent.trim()).to.equal('Select...');
  });

  it('renders custom placeholder', async () => {
    const el = await fixture(html`<naevo-select placeholder="Pick one" .options=${OPTIONS}></naevo-select>`);
    expect(el.shadowRoot.querySelector('.select-value').textContent.trim()).to.equal('Pick one');
  });

  it('renders the selected option label', async () => {
    const el = await fixture(html`<naevo-select value="pear" .options=${OPTIONS}></naevo-select>`);
    expect(el.shadowRoot.querySelector('.select-value').textContent.trim()).to.equal('Pears');
  });

  it('renders label with required marker', async () => {
    const el = await fixture(html`<naevo-select label="Fruit" required .options=${OPTIONS}></naevo-select>`);
    expect(el.shadowRoot.querySelector('label')).to.exist;
    expect(el.shadowRoot.querySelector('.required-marker')).to.exist;
  });

  it('is closed by default', async () => {
    const el = await createSelect();
    expect(getListbox(el)).to.be.null;
    expect(getTrigger(el).getAttribute('aria-expanded')).to.equal('false');
  });

  // ---------- Mouse ----------

  it('opens on click', async () => {
    const el = await createSelect();
    getTrigger(el).click();
    await el.updateComplete;

    expect(getListbox(el)).to.exist;
    expect(getOptions(el).length).to.equal(3);
    expect(getTrigger(el).getAttribute('aria-expanded')).to.equal('true');
  });

  it('selects an option on click, closes, and fires naevo-select', async () => {
    const el = await createSelect();
    getTrigger(el).click();
    await el.updateComplete;

    setTimeout(() => getOptions(el)[1].click());
    const event = await oneEvent(el, 'naevo-select');
    await el.updateComplete;

    expect(event.detail.value).to.equal('pear');
    expect(el.value).to.equal('pear');
    expect(getListbox(el)).to.be.null;
  });

  it('marks the selected option with aria-selected', async () => {
    const el = await fixture(html`<naevo-select value="banana" .options=${OPTIONS}></naevo-select>`);
    getTrigger(el).click();
    await el.updateComplete;

    const opts = getOptions(el);
    expect(opts[2].getAttribute('aria-selected')).to.equal('true');
    expect(opts[0].getAttribute('aria-selected')).to.equal('false');
  });

  it('closes on blur', async () => {
    const el = await createSelect();
    getTrigger(el).click();
    await el.updateComplete;

    getTrigger(el).dispatchEvent(new FocusEvent('blur'));
    await el.updateComplete;

    expect(getListbox(el)).to.be.null;
  });

  // ---------- Keyboard ----------

  it('ArrowDown opens and highlights the first option', async () => {
    const el = await createSelect();
    await press(el, 'ArrowDown');

    expect(getListbox(el)).to.exist;
    expect(el._activeIndex).to.equal(0);
    expect(getTrigger(el).getAttribute('aria-activedescendant')).to.equal('option-0');
  });

  it('ArrowDown wraps from last to first', async () => {
    const el = await createSelect();
    await press(el, 'ArrowDown'); // 0
    await press(el, 'ArrowDown'); // 1
    await press(el, 'ArrowDown'); // 2
    await press(el, 'ArrowDown'); // wrap → 0

    expect(el._activeIndex).to.equal(0);
  });

  it('ArrowUp wraps from first to last', async () => {
    const el = await createSelect();
    await press(el, 'ArrowDown'); // 0
    await press(el, 'ArrowUp'); // wrap → 2

    expect(el._activeIndex).to.equal(2);
  });

  it('Enter selects the first option (index 0 regression)', async () => {
    const el = await createSelect();
    await press(el, 'ArrowDown'); // 0
    await press(el, 'Enter');

    expect(el.value).to.equal('apple');
    expect(getListbox(el)).to.be.null;
  });

  it('Escape closes without selecting', async () => {
    const el = await createSelect();
    await press(el, 'ArrowDown');
    await press(el, 'Escape');

    expect(getListbox(el)).to.be.null;
    expect(el._activeIndex).to.be.null;
    expect(el.value).to.equal('');
  });

  it('ignores keys when there are no options', async () => {
    const el = await fixture(html`<naevo-select label="Fruit"></naevo-select>`);
    await press(el, 'ArrowDown');

    expect(el._open).to.be.false;
    expect(el._activeIndex).to.be.null;
  });

  // ---------- Disabled ----------

  it('disabled select is removed from tab order', async () => {
    const el = await fixture(html`<naevo-select label="Fruit" disabled .options=${OPTIONS}></naevo-select>`);
    expect(getTrigger(el).getAttribute('tabindex')).to.equal('-1');
    expect(getTrigger(el).getAttribute('aria-disabled')).to.equal('true');
  });

  // ---------- Accessibility ----------

  it('is accessible when closed', async () => {
    const el = await createSelect();
    await expect(el).to.be.accessible();
  });

  it('is accessible when open', async () => {
    const el = await createSelect();
    await press(el, 'ArrowDown');
    await expect(el).to.be.accessible();
  });
});