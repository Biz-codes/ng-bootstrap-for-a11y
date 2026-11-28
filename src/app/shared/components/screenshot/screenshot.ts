import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ScreenshotCallout {
  x: number;
  y: number;
}

@Component({
  selector: 'app-screenshot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="figure d-block mb-0">
      <div class="position-relative">
        @if (src(); as src) {
          <img class="figure-img img-fluid rounded-3 border mb-0" [src]="src" [alt]="alt()" />
        } @else {
          <div
            class="ratio ratio-21x9 bg-body-tertiary border border-2 rounded-3"
            role="img"
            [attr.aria-label]="alt()"
          >
            <div
              class="d-flex flex-column align-items-center justify-content-center gap-2 p-3 text-body-secondary small text-center"
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
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <span aria-hidden="true">{{ alt() }}</span>
            </div>
          </div>
        }
        @for (callout of callouts(); track $index) {
          <span
            class="position-absolute translate-middle badge rounded-pill bg-primary"
            aria-hidden="true"
            [style.left.%]="callout.x"
            [style.top.%]="callout.y"
            >{{ $index + 1 }}</span
          >
        }
      </div>
      <figcaption class="figure-caption mt-2"><ng-content /></figcaption>
    </figure>
  `,
})
export class ScreenshotComponent {
  readonly src = input<string>();
  readonly alt = input.required<string>();
  readonly callouts = input<readonly ScreenshotCallout[]>([]);
}
