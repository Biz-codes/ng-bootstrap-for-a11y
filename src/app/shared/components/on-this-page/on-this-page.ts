import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

export interface PageSection {
  id: string;
  heading: string;
}

let nextId = 0;

@Component({
  selector: 'app-on-this-page',
  imports: [NgbCollapse, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './on-this-page.html',
})
export class OnThisPageComponent {
  readonly sections = input.required<readonly PageSection[]>();

  protected readonly collapsed = signal(true);
  protected readonly labelId = `on-this-page-label-${nextId}`;
  protected readonly listId = `on-this-page-list-${nextId++}`;

  protected toggle(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }

  protected collapse(): void {
    this.collapsed.set(true);
  }
}
