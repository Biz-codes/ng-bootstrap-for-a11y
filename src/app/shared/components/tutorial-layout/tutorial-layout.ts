import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { OnThisPageComponent, PageSection } from '../on-this-page/on-this-page';
import { Status, StatusBadgeComponent } from '../status-badge/status-badge';
import { TutorialSectionComponent } from '../tutorial-section/tutorial-section';

export interface TutorialLink {
  title: string;
  link: string | readonly unknown[];
}

@Component({
  selector: 'app-tutorial-layout',
  imports: [OnThisPageComponent, RouterLink, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tutorial-layout.html',
})
export class TutorialLayoutComponent {
  readonly title = input.required<string>();
  readonly status = input<Status>();
  readonly previous = input<TutorialLink>();
  readonly next = input<TutorialLink>();

  private readonly sections = contentChildren(TutorialSectionComponent, { descendants: true });

  protected readonly pageSections = computed<PageSection[]>(() =>
    this.sections().map((section) => ({ id: section.id(), heading: section.heading() })),
  );
}
