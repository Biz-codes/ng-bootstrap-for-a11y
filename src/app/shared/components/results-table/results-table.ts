import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PassFail, PassFailBadgeComponent } from '../pass-fail/pass-fail';

export interface ResultRow {
  cells: readonly string[];
  result: PassFail;
}

let nextId = 0;

@Component({
  selector: 'app-results-table',
  imports: [PassFailBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="table-responsive border rounded-3"
      role="region"
      tabindex="0"
      [attr.aria-labelledby]="captionId"
    >
      <table class="table align-middle small mb-0">
        <caption [id]="captionId" class="visually-hidden">
          {{
            label()
          }}
        </caption>
        <thead>
          <tr>
            @for (header of headers(); track $index) {
              <th scope="col" class="bg-body-tertiary px-3 py-2">{{ header }}</th>
            }
            <th scope="col" class="bg-body-tertiary px-3 py-2">{{ resultHeader() }}</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track $index) {
            <tr>
              @for (cell of row.cells; track $index; let first = $first) {
                @if (first) {
                  <th scope="row" class="fw-semibold px-3 py-2">{{ cell }}</th>
                } @else {
                  <td class="px-3 py-2">{{ cell }}</td>
                }
              }
              <td class="px-3 py-2"><app-pass-fail [result]="row.result" /></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class ResultsTableComponent {
  readonly label = input.required<string>();
  readonly headers = input.required<readonly string[]>();
  readonly resultHeader = input.required<string>();
  readonly rows = input<readonly ResultRow[]>([]);

  protected readonly captionId = `results-table-caption-${nextId++}`;
}
