import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type Status = 'coming-soon' | 'under-construction';

const STATUSES: Record<Status, { label: string; classes: string }> = {
  'coming-soon': {
    label: 'Coming soon',
    classes: 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle',
  },
  'under-construction': {
    label: 'Under construction',
    classes: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle',
  },
};

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge text-uppercase align-middle" [class]="config().classes">{{
    config().label
  }}</span>`,
})
export class StatusBadgeComponent {
  readonly status = input.required<Status>();

  protected readonly config = computed(() => STATUSES[this.status()]);
}
