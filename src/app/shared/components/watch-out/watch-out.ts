import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-watch-out',
  imports: [NgbPopover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="btn btn-warning btn-sm rounded-pill lh-lg px-3 py-2 d-inline-flex align-items-center gap-2 fw-bold"
      [attr.aria-label]="'Watch out: ' + title()"
      [attr.aria-expanded]="popover.isOpen()"
      [ngbPopover]="content"
      #popover="ngbPopover"
      triggers="click"
      autoClose="outside"
      placement="bottom-start top-start bottom-end top-end"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      Watch out
    </button>
    <ng-template #content><ng-content /></ng-template>
  `,
})
export class WatchOutComponent {
  readonly title = input.required<string>();
}
