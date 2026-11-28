import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { ScreenshotCallout, ScreenshotComponent } from './screenshot';

@Component({
  imports: [ScreenshotComponent],
  template: `
    <app-screenshot [src]="src()" alt="[Alt text: what to notice]" [callouts]="callouts()">
      <span class="caption">[Caption]</span>
    </app-screenshot>
  `,
})
class HostComponent {
  readonly src = signal<string | undefined>(undefined);
  readonly callouts = signal<ScreenshotCallout[]>([
    { x: 30, y: 25 },
    { x: 62, y: 55 },
  ]);
}

describe('ScreenshotComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  const figure = () => element.querySelector('figure')!;
  const markers = () => Array.from(element.querySelectorAll<HTMLElement>('.badge'));

  async function render(): Promise<void> {
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await render();
  });

  it('is a Bootstrap figure with the projected caption', () => {
    expect(figure().classList).toContain('figure');
    const caption = figure().querySelector('figcaption')!;
    expect(caption.classList).toContain('figure-caption');
    expect(caption.querySelector('.caption')?.textContent).toBe('[Caption]');
  });

  describe('without an image yet', () => {
    it('shows a placeholder exposed as an image named by the alt text', () => {
      expect(figure().querySelector('img')).toBeNull();
      const placeholder = figure().querySelector('[role="img"]')!;
      expect(placeholder.getAttribute('aria-label')).toBe('[Alt text: what to notice]');
      expect(placeholder.classList).toContain('ratio');
    });

    it('shows the alt text visibly without reading it twice', () => {
      const visible = figure().querySelector('[role="img"] span')!;
      expect(visible.textContent?.trim()).toBe('[Alt text: what to notice]');
      expect(visible.getAttribute('aria-hidden')).toBe('true');
    });

    it('has no axe violations', async () => {
      await expectNoAxeViolations(element);
    });
  });

  describe('with an image', () => {
    beforeEach(async () => {
      host.src.set('/images/example.png');
      await render();
    });

    it('renders a responsive figure image with the alt text', () => {
      const img = figure().querySelector('img')!;
      expect(img.getAttribute('src')).toBe('/images/example.png');
      expect(img.getAttribute('alt')).toBe('[Alt text: what to notice]');
      expect(img.classList).toContain('figure-img');
      expect(img.classList).toContain('img-fluid');
      expect(figure().querySelector('[role="img"]')).toBeNull();
    });

    it('has no axe violations', async () => {
      await expectNoAxeViolations(element);
    });
  });

  describe('numbered callouts', () => {
    it('numbers each callout from 1 in order', () => {
      expect(markers().map((marker) => marker.textContent?.trim())).toEqual(['1', '2']);
    });

    it('positions each callout by percentage over the image', () => {
      expect(markers()[0].style.left).toBe('30%');
      expect(markers()[0].style.top).toBe('25%');
      expect(markers()[1].style.left).toBe('62%');
      expect(markers()[1].classList).toContain('position-absolute');
      expect(markers()[1].classList).toContain('translate-middle');
    });

    it('hides the markers from assistive technology, leaving the alt text and caption', () => {
      for (const marker of markers()) {
        expect(marker.getAttribute('aria-hidden')).toBe('true');
      }
    });

    it('renders no markers when there are no callouts', async () => {
      host.callouts.set([]);
      await render();
      expect(markers()).toHaveLength(0);
    });
  });
});
