import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { ResultRow, ResultsTableComponent } from './results-table';

describe('ResultsTableComponent', () => {
  let fixture: ComponentFixture<ResultsTableComponent>;
  let element: HTMLElement;

  const headers = ['[Test]', '[Tool]', '[What happened]', '[WCAG]'];
  const rows: ResultRow[] = [
    { cells: ['[Test one]', '[Tool]', '[Observed]', '[1.1.1]'], result: 'fail' },
    { cells: ['[Test two]', '[Tool]', '[Observed]', '[2.1.1]'], result: 'pass' },
  ];

  const wrapper = () => element.querySelector<HTMLElement>('.table-responsive')!;
  const table = () => element.querySelector('table')!;
  const columnHeaders = () =>
    Array.from(table().querySelectorAll('thead th')).map((th) => th.textContent?.trim());
  const bodyRows = () => Array.from(table().querySelectorAll('tbody tr'));

  async function render(overrides: Partial<Record<string, unknown>> = {}): Promise<void> {
    const inputs = {
      label: '[Table label]',
      headers,
      resultHeader: '[Result]',
      rows,
      ...overrides,
    };
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ResultsTableComponent] }).compileComponents();
    fixture = TestBed.createComponent(ResultsTableComponent);
    element = fixture.nativeElement;
    await render();
  });

  describe('table structure', () => {
    it('uses Bootstrap table classes inside a responsive wrapper', () => {
      expect(wrapper().classList).toContain('table-responsive');
      expect(table().classList).toContain('table');
      expect(table().classList).toContain('align-middle');
    });

    it('has a visually hidden caption holding the label', () => {
      const caption = table().querySelector('caption')!;
      expect(caption.textContent?.trim()).toBe('[Table label]');
      expect(caption.classList).toContain('visually-hidden');
    });

    it('renders the column headers, then the result header, all scoped to columns', () => {
      expect(columnHeaders()).toEqual([...headers, '[Result]']);
      for (const th of Array.from(table().querySelectorAll('thead th'))) {
        expect(th.getAttribute('scope')).toBe('col');
      }
    });

    it('renders one row per result, with the first cell as a row header', () => {
      expect(bodyRows()).toHaveLength(2);
      const rowHeader = bodyRows()[0].querySelector('th')!;
      expect(rowHeader.getAttribute('scope')).toBe('row');
      expect(rowHeader.textContent?.trim()).toBe('[Test one]');
      const cells = Array.from(bodyRows()[0].querySelectorAll('td')).map((td) =>
        td.textContent?.trim(),
      );
      expect(cells).toEqual(['[Tool]', '[Observed]', '[1.1.1]', 'Fail']);
    });

    it('shows each result as a pass/fail badge in the last column', () => {
      const badges = bodyRows().map((row) =>
        row.querySelector('td:last-child app-pass-fail .badge'),
      );
      expect(badges.map((badge) => badge?.textContent?.trim())).toEqual(['Fail', 'Pass']);
    });

    it('updates when the rows change', async () => {
      await render({ rows: [rows[1]] });
      expect(bodyRows()).toHaveLength(1);
      expect(bodyRows()[0].querySelector('th')?.textContent?.trim()).toBe('[Test two]');
    });
  });

  describe('sideways scrolling', () => {
    it('is a keyboard-focusable region named by the caption', () => {
      expect(wrapper().getAttribute('role')).toBe('region');
      expect(wrapper().getAttribute('tabindex')).toBe('0');
      const caption = table().querySelector('caption')!;
      expect(wrapper().getAttribute('aria-labelledby')).toBe(caption.id);
      wrapper().focus();
      expect(document.activeElement).toBe(wrapper());
    });

    it('gives each instance a unique caption id', async () => {
      const second = TestBed.createComponent(ResultsTableComponent);
      second.componentRef.setInput('label', '[Second]');
      second.componentRef.setInput('headers', headers);
      second.componentRef.setInput('resultHeader', '[Result]');
      await second.whenStable();
      const secondCaption = (second.nativeElement as HTMLElement).querySelector('caption')!;
      expect(secondCaption.id).not.toBe(table().querySelector('caption')!.id);
    });
  });

  describe('axe', () => {
    it('has no violations with rows', async () => {
      await expectNoAxeViolations(element);
    });

    it('has no violations with no rows', async () => {
      await render({ rows: [] });
      await expectNoAxeViolations(element);
    });
  });
});
