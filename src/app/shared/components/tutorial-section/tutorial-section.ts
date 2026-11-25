import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tutorial-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.id]': 'null' },
  template: `
    <section [id]="id()" class="d-flex flex-column gap-3">
      <div class="d-flex flex-wrap align-items-baseline gap-2">
        @if (number() !== undefined) {
          <span class="small fw-bold text-primary">{{ number() }}</span>
        }
        <h2 class="mb-0">{{ heading() }}</h2>
      </div>
      <ng-content />
    </section>
  `,
})
export class TutorialSectionComponent {
  readonly heading = input.required<string>();
  readonly id = input.required<string>();
  readonly number = input<number>();
}
