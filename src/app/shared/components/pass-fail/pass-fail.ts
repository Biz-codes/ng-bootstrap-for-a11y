import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type PassFail = 'pass' | 'fail';

@Component({
  selector: 'app-pass-fail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (result() === 'pass') {
      <span
        class="badge d-inline-flex align-items-center gap-1 bg-success-subtle text-success-emphasis"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Pass
      </span>
    } @else {
      <span
        class="badge d-inline-flex align-items-center gap-1 bg-danger-subtle text-danger-emphasis"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        Fail
      </span>
    }
  `,
})
export class PassFailBadgeComponent {
  readonly result = input.required<PassFail>();
}
