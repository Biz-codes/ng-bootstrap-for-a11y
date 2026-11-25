import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Status, StatusBadgeComponent } from '../status-badge/status-badge';

export interface TutorialLink {
  title: string;
  link: string | readonly unknown[];
}

@Component({
  selector: 'app-tutorial-layout',
  imports: [RouterLink, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tutorial-layout.html',
})
export class TutorialLayoutComponent {
  readonly title = input.required<string>();
  readonly status = input<Status>();
  readonly previous = input<TutorialLink>();
  readonly next = input<TutorialLink>();
}
