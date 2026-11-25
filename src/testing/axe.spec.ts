import { expectNoAxeViolations, formatViolations, runAxe } from './axe';

describe('axe helper', () => {
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => host.remove());

  it('passes accessible markup', async () => {
    host.innerHTML = '<button type="button">Copy code</button>';
    await expectNoAxeViolations(host);
  });

  it('reports a button with no accessible name', async () => {
    host.innerHTML = '<button type="button"><svg aria-hidden="true"></svg></button>';
    const violations = await runAxe(host);
    expect(violations.map((v) => v.id)).toContain('button-name');
    expect(formatViolations(violations)).toContain('button-name');
  });

  it('lets a spec turn a default-off rule back on', async () => {
    host.innerHTML = '<p>Outside any landmark</p>';
    const violations = await runAxe(document, { rules: { region: { enabled: true } } });
    expect(violations.map((v) => v.id)).toContain('region');
  });
});
