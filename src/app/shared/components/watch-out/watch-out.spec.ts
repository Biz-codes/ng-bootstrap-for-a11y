import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { WatchOutComponent } from './watch-out';

@Component({
  imports: [WatchOutComponent],
  template: `
    <p>[Step text]</p>
    <app-watch-out title="[Common mistake]">
      <span class="note">[Short note]</span>
    </app-watch-out>
    <button type="button" class="outside">[Elsewhere]</button>
  `,
})
class HostComponent {}

describe('WatchOutComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  const button = () => element.querySelector<HTMLButtonElement>('app-watch-out button')!;
  const popover = () => document.querySelector<HTMLElement>('ngb-popover-window');

  async function render(): Promise<void> {
    await fixture.whenStable();
  }

  async function open(): Promise<void> {
    button().click();
    await render();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    TestBed.inject(NgbConfig).animation = false;
    fixture = TestBed.createComponent(HostComponent);
    element = fixture.nativeElement;
    await render();
  });

  afterEach(() => {
    document.querySelectorAll('ngb-popover-window').forEach((window) => window.remove());
  });

  describe('button', () => {
    it('is a warning pill button with a visible "Watch out" label', () => {
      expect(button().type).toBe('button');
      expect(button().classList).toContain('btn-warning');
      expect(button().classList).toContain('rounded-pill');
      expect(button().textContent?.trim()).toBe('Watch out');
    });

    it('has an accessible name that starts with its visible label and names the mistake', () => {
      expect(button().getAttribute('aria-label')).toBe('Watch out: [Common mistake]');
    });

    it('hides its icon from assistive technology', () => {
      const svg = button().querySelector('svg')!;
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.getAttribute('focusable')).toBe('false');
    });

    it('starts closed with aria-expanded="false"', () => {
      expect(button().getAttribute('aria-expanded')).toBe('false');
      expect(popover()).toBeNull();
    });
  });

  describe('popover', () => {
    it('opens on click, showing the projected note', async () => {
      await open();
      expect(button().getAttribute('aria-expanded')).toBe('true');
      expect(popover()?.querySelector('.note')?.textContent).toBe('[Short note]');
    });

    it('has no header or buttons, only the note', async () => {
      await open();
      expect(popover()!.querySelector('.popover-header')).toBeNull();
      expect(popover()!.querySelector('button')).toBeNull();
    });

    it('is described to the button while open', async () => {
      await open();
      expect(button().getAttribute('aria-describedby')).toBe(popover()!.id);
    });

    it('renders right after the button, so it follows it in reading order', async () => {
      await open();
      expect(button().nextElementSibling).toBe(popover());
    });

    it('closes when the button is clicked again', async () => {
      await open();
      await open();
      expect(button().getAttribute('aria-expanded')).toBe('false');
      expect(popover()).toBeNull();
    });

    it('closes on Escape and leaves focus on the button', async () => {
      button().focus();
      await open();
      button().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await render();
      expect(popover()).toBeNull();
      expect(document.activeElement).toBe(button());
    });

    it('closes on a click outside', async () => {
      await open();
      await new Promise((resolve) => setTimeout(resolve));
      const outside = element.querySelector<HTMLButtonElement>('.outside')!;
      outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      outside.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      outside.click();
      await new Promise((resolve) => setTimeout(resolve));
      await render();
      expect(popover()).toBeNull();
    });

    it('stays open on a click inside the note', async () => {
      await open();
      await new Promise((resolve) => setTimeout(resolve));
      const note = popover()!.querySelector<HTMLElement>('.note')!;
      note.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      note.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      note.click();
      await new Promise((resolve) => setTimeout(resolve));
      await render();
      expect(popover()).not.toBeNull();
    });

    it('shows the note again when reopened', async () => {
      await open();
      await open();
      await open();
      expect(popover()?.querySelector('.note')?.textContent).toBe('[Short note]');
    });
  });

  describe('axe', () => {
    it('has no violations when closed', async () => {
      await expectNoAxeViolations(element);
    });

    it('has no violations when open', async () => {
      await open();
      await expectNoAxeViolations(element);
    });
  });
});
