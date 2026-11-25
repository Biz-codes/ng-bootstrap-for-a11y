import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CodeFile, CodeViewerComponent } from '../code-viewer/code-viewer';

let nextId = 0;

@Component({
  selector: 'app-working-example',
  imports: [CodeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" role="group" [attr.aria-labelledby]="labelId">
      <div class="card-header bg-body py-2">
        <span [id]="labelId" class="small fw-bold text-uppercase text-body-secondary">{{
          label()
        }}</span>
      </div>
      <div class="card-body bg-body-tertiary d-flex justify-content-center px-4 py-5">
        <ng-content />
      </div>
      @if (files().length) {
        <app-code-viewer
          class="d-block border-top rounded-bottom overflow-hidden"
          [files]="files()"
        />
      }
    </div>
  `,
})
export class WorkingExampleComponent {
  readonly label = input.required<string>();
  readonly files = input<readonly CodeFile[]>([]);

  protected readonly labelId = `working-example-label-${nextId++}`;
}
