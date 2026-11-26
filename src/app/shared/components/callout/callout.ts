import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CalloutType = 'note' | 'tip' | 'result';

const CALLOUTS: Record<CalloutType, { label: string; alert: string }> = {
  note: { label: 'Note:', alert: 'alert-primary' },
  tip: { label: 'Tip:', alert: 'alert-info' },
  result: { label: 'You should now see:', alert: 'alert-success' },
};

@Component({
  selector: 'app-callout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="alert d-flex align-items-start gap-2 mb-0" [class]="config().alert">
      @if (type() === 'result') {
        <svg
          class="flex-shrink-0 mt-1"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      }
      <div>
        <strong>{{ config().label }}</strong>&ngsp;<ng-content />
      </div>
    </div>
  `,
})
export class CalloutComponent {
  readonly type = input.required<CalloutType>();

  protected readonly config = computed(() => CALLOUTS[this.type()]);
}
