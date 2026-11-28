import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectNoAxeViolations, runAxe } from '../../../../testing/axe';
import { VideoComponent } from './video';

@Component({
  imports: [VideoComponent],
  template: `
    <app-video [src]="src()" title="[Video title]" [captions]="captions()">
      <a class="transcript" href="#transcript">[Transcript link]</a>
    </app-video>
  `,
})
class HostComponent {
  readonly src = signal<string | undefined>(undefined);
  readonly captions = signal<string | undefined>(undefined);
}

describe('VideoComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  const figure = () => element.querySelector('figure')!;
  const video = () => figure().querySelector('video');

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

  it('projects caption content, such as a transcript link, into the figcaption', () => {
    const caption = figure().querySelector('figcaption')!;
    expect(caption.classList).toContain('figure-caption');
    expect(caption.querySelector('.transcript')?.textContent).toBe('[Transcript link]');
  });

  describe('without a video yet', () => {
    it('shows the "Screen recording coming soon..." placeholder in a 16:9 box', () => {
      expect(video()).toBeNull();
      const placeholder = figure().querySelector('.ratio-16x9')!;
      expect(placeholder.classList).toContain('text-bg-dark');
      expect(placeholder.textContent?.trim()).toBe('Screen recording coming soon...');
    });

    it('hides the placeholder icon from assistive technology', () => {
      const svg = figure().querySelector('svg')!;
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.getAttribute('focusable')).toBe('false');
    });

    it('has no axe violations', async () => {
      await expectNoAxeViolations(element);
    });
  });

  describe('with a video', () => {
    beforeEach(async () => {
      host.src.set('/videos/example.mp4');
      host.captions.set('/videos/example.vtt');
      await render();
    });

    it('renders a native video with controls, named by the title', () => {
      expect(video()?.getAttribute('src')).toBe('/videos/example.mp4');
      expect(video()?.hasAttribute('controls')).toBe(true);
      expect(video()?.getAttribute('aria-label')).toBe('[Video title]');
      expect(figure().querySelector('.ratio-16x9')).toBeNull();
    });

    it('adds an English captions track on by default', () => {
      const track = video()!.querySelector('track')!;
      expect(track.getAttribute('kind')).toBe('captions');
      expect(track.getAttribute('src')).toBe('/videos/example.vtt');
      expect(track.getAttribute('srclang')).toBe('en');
      expect(track.hasAttribute('default')).toBe(true);
    });

    it('has no axe violations with captions', async () => {
      await expectNoAxeViolations(element);
    });

    it('keeps the placeholder until captions are set, since axe only flags missing captions for review', async () => {
      host.captions.set(undefined);
      await render();
      expect(video()).toBeNull();
      expect(figure().querySelector('.ratio-16x9')?.textContent?.trim()).toBe(
        'Screen recording coming soon...',
      );
      const violations = await runAxe(element);
      expect(violations).toEqual([]);
    });
  });
});
