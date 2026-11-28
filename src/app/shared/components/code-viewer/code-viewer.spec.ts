import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { CodeFile, CodeViewerComponent } from './code-viewer';

describe('CodeViewerComponent', () => {
  let fixture: ComponentFixture<CodeViewerComponent>;
  let element: HTMLElement;
  let writeText: ReturnType<typeof vi.fn>;

  const files: CodeFile[] = [
    { name: 'toolbar.html', language: 'xml', code: '<button type="button">[Label]</button>' },
    { name: 'toolbar.ts', language: 'typescript', code: 'export class Toolbar {}' },
    { name: 'notes.txt', language: 'plaintext', code: 'a < b && c > d' },
  ];

  const toggle = () => element.querySelector<HTMLButtonElement>('button[aria-controls]')!;
  const panel = () =>
    element.querySelector<HTMLElement>(`#${toggle().getAttribute('aria-controls')}`)!;
  const tablist = () => element.querySelector<HTMLElement>('[role="tablist"]')!;
  const tabs = () => Array.from(element.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const tabpanel = () => element.querySelector<HTMLElement>('[role="tabpanel"]')!;
  const code = () => tabpanel().querySelector('code')!;
  const copyButton = () =>
    element.querySelector<HTMLButtonElement>('button[aria-label="Copy code"]')!;
  const status = () => element.querySelector('[role="status"]')!;

  async function render(): Promise<void> {
    await fixture.whenStable();
  }

  async function expand(): Promise<void> {
    toggle().click();
    await render();
  }

  beforeEach(async () => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    await TestBed.configureTestingModule({ imports: [CodeViewerComponent] }).compileComponents();
    TestBed.inject(NgbConfig).animation = false;
    fixture = TestBed.createComponent(CodeViewerComponent);
    fixture.componentRef.setInput('files', files);
    element = fixture.nativeElement;
    await render();
  });

  afterEach(() => {
    document.querySelectorAll('ngb-tooltip-window').forEach((tooltip) => tooltip.remove());
  });

  describe('view code toggle', () => {
    it('starts collapsed, labelled "View code"', () => {
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(toggle().textContent?.trim()).toBe('View code');
      expect(panel().classList).toContain('collapse');
      expect(panel().classList).not.toContain('show');
    });

    it('expands to show the code, relabelled "Hide code"', async () => {
      await expand();
      expect(toggle().getAttribute('aria-expanded')).toBe('true');
      expect(toggle().textContent?.trim()).toBe('Hide code');
      expect(panel().classList).toContain('show');
    });

    it('collapses again', async () => {
      await expand();
      await expand();
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(panel().classList).not.toContain('show');
    });

    it('hides its icon from assistive technology', () => {
      expect(toggle().querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('file tabs', () => {
    beforeEach(expand);

    it('is a tablist named "Files" with one tab per file', () => {
      expect(tablist().getAttribute('aria-label')).toBe('Files');
      expect(tabs().map((tab) => tab.textContent?.trim())).toEqual([
        'toolbar.html',
        'toolbar.ts',
        'notes.txt',
      ]);
    });

    it('selects the first file and labels the panel with its tab', () => {
      expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
      expect(tabs()[1].getAttribute('aria-selected')).toBe('false');
      expect(tabpanel().getAttribute('aria-labelledby')).toBe(tabs()[0].id);
      expect(code().textContent).toBe(files[0].code);
    });

    it('shows another file when its tab is chosen', async () => {
      tabs()[1].click();
      await render();
      expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
      expect(code().textContent).toBe(files[1].code);
    });

    it('moves between tabs with the arrow keys', async () => {
      tabs()[0].focus();
      tabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await render();
      expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
      expect(document.activeElement).toBe(tabs()[1]);
    });

    it('keeps the tabs on one row that scrolls sideways', () => {
      expect(tablist().classList).toContain('flex-nowrap');
      expect(tablist().classList).toContain('overflow-x-auto');
    });
  });

  describe('code', () => {
    beforeEach(expand);

    it('highlights known languages with highlight.js classes', async () => {
      tabs()[1].click();
      await render();
      expect(code().querySelector('.hljs-keyword')?.textContent).toBe('export');
    });

    it('shows unknown languages as escaped plain text', async () => {
      tabs()[2].click();
      await render();
      expect(code().textContent).toBe('a < b && c > d');
      expect(code().children).toHaveLength(0);
    });

    it('scrolls sideways inside a focusable block', () => {
      const pre = tabpanel().querySelector('pre')!;
      expect(pre.classList).toContain('hljs');
      expect(pre.getAttribute('tabindex')).toBe('0');
      pre.focus();
      expect(document.activeElement).toBe(pre);
    });

    it('sits on a dark Bootstrap surface', () => {
      expect(panel().querySelector('[data-bs-theme="dark"]')).not.toBeNull();
    });
  });

  describe('copy code', () => {
    beforeEach(expand);

    it('is an icon button named "Copy code" with a matching tooltip', async () => {
      expect(copyButton().type).toBe('button');
      expect(copyButton().querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
      copyButton().dispatchEvent(new Event('mouseenter'));
      await render();
      expect(document.querySelector('ngb-tooltip-window')?.textContent?.trim()).toBe('Copy code');
    });

    it('copies the selected file and announces it', async () => {
      tabs()[1].click();
      await render();
      copyButton().click();
      await render();
      expect(writeText).toHaveBeenCalledWith(files[1].code);
      expect(status().textContent?.trim()).toBe('Copied');
    });

    it('announces a failed copy', async () => {
      writeText.mockRejectedValueOnce(new Error('denied'));
      copyButton().click();
      await render();
      expect(status().textContent?.trim()).toBe('Copy failed');
    });

    it('clears the announcement when another file is chosen', async () => {
      copyButton().click();
      await render();
      tabs()[1].click();
      await render();
      expect(status().textContent?.trim()).toBe('');
    });

    it('keeps the status region in the page before anything is copied', () => {
      expect(status()).not.toBeNull();
      expect(status().classList).toContain('visually-hidden');
    });
  });

  describe('axe', () => {
    it('has no violations when collapsed', async () => {
      await expectNoAxeViolations(element);
    });

    it('has no violations when expanded', async () => {
      await expand();
      await expectNoAxeViolations(element);
    });
  });
});
