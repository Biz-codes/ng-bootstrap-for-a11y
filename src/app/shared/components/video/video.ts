import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="figure d-block mb-0">
      @if (src() && captions()) {
        <video
          class="w-100 rounded-3 bg-dark"
          controls
          preload="metadata"
          [src]="src()"
          [attr.aria-label]="title()"
        >
          <track kind="captions" srclang="en" label="English" [src]="captions()" default />
        </video>
      } @else {
        <div class="ratio ratio-16x9 rounded-3 text-bg-dark">
          <div
            class="d-flex flex-column align-items-center justify-content-center gap-2 p-3 text-center"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="2" y="5" width="15" height="14" rx="2" />
              <path d="m17 10 5-3v10l-5-3" />
            </svg>
            <p class="mb-0">Screen recording coming soon...</p>
          </div>
        </div>
      }
      <figcaption class="figure-caption mt-2"><ng-content /></figcaption>
    </figure>
  `,
})
export class VideoComponent {
  readonly src = input<string>();
  readonly title = input.required<string>();
  readonly captions = input<string>();
}
