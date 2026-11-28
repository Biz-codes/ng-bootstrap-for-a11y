import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CalloutComponent } from '../../shared/components/callout/callout';
import { CodeFile, CodeViewerComponent } from '../../shared/components/code-viewer/code-viewer';
import { PassFailBadgeComponent } from '../../shared/components/pass-fail/pass-fail';
import {
  ResultRow,
  ResultsTableComponent,
} from '../../shared/components/results-table/results-table';
import {
  ScreenshotCallout,
  ScreenshotComponent,
} from '../../shared/components/screenshot/screenshot';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge';
import {
  TicketComponent,
  TicketCriterion,
  TicketLink,
} from '../../shared/components/ticket/ticket';
import {
  TutorialLayoutComponent,
  TutorialLink,
} from '../../shared/components/tutorial-layout/tutorial-layout';
import { TutorialSectionComponent } from '../../shared/components/tutorial-section/tutorial-section';
import { VideoComponent } from '../../shared/components/video/video';
import { WatchOutComponent } from '../../shared/components/watch-out/watch-out';
import { WorkingExampleComponent } from '../../shared/components/working-example/working-example';

@Component({
  selector: 'app-component-demo',
  imports: [
    CalloutComponent,
    CodeViewerComponent,
    NgbTooltip,
    PassFailBadgeComponent,
    ResultsTableComponent,
    ScreenshotComponent,
    StatusBadgeComponent,
    TicketComponent,
    TutorialLayoutComponent,
    TutorialSectionComponent,
    VideoComponent,
    WatchOutComponent,
    WorkingExampleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-demo.html',
})
export class ComponentDemoComponent {
  protected readonly previous: TutorialLink = { title: '[Previous page]', link: '/dev/components' };
  protected readonly next: TutorialLink = { title: '[Next page]', link: '/dev/components' };

  protected readonly criteria: TicketCriterion[] = [
    { id: 'AC1', text: '[Acceptance criterion]' },
    { id: 'AC2', text: '[Acceptance criterion]' },
    { id: 'AC3', text: '[Acceptance criterion]' },
  ];

  protected readonly ngbLinks: TicketLink[] = [
    {
      label: 'ng-bootstrap: Tooltip',
      href: 'https://ng-bootstrap.github.io/#/components/tooltip/overview',
    },
    {
      label: 'ng-bootstrap: Tooltip API',
      href: 'https://ng-bootstrap.github.io/#/components/tooltip/api',
    },
  ];

  protected readonly wcagLinks: TicketLink[] = [
    {
      label: 'WCAG 1.4.13 Content on Hover or Focus',
      href: 'https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html',
    },
    {
      label: 'WCAG 2.1.1 Keyboard',
      href: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html',
    },
  ];

  protected readonly files: CodeFile[] = [
    {
      name: 'toolbar.html',
      language: 'xml',
      code: [
        '<div role="toolbar" aria-label="[Toolbar label]">',
        '  <button type="button" class="btn btn-outline-secondary" aria-label="[Button label]" ngbTooltip="[Button label]">',
        '    <svg aria-hidden="true"><!-- [icon] --></svg>',
        '  </button>',
        '</div>',
      ].join('\n'),
    },
    {
      name: 'toolbar.ts',
      language: 'typescript',
      code: [
        "import { Component } from '@angular/core';",
        "import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';",
        '',
        '@Component({',
        "  selector: 'app-toolbar',",
        '  imports: [NgbTooltip],',
        "  templateUrl: './toolbar.html',",
        '})',
        'export class ToolbarComponent {}',
      ].join('\n'),
    },
    {
      name: 'notes.txt',
      language: 'plaintext',
      code: '[Plain text file: shown without highlighting]',
    },
  ];

  protected readonly resultHeaders = ['Test', 'Tool', 'What happened', 'WCAG'];

  protected readonly results: ResultRow[] = [
    { cells: ['[Test]', '[Tool]', '[Observed result]', '[WCAG criterion]'], result: 'fail' },
    { cells: ['[Test]', '[Tool]', '[Observed result]', '[WCAG criterion]'], result: 'pass' },
  ];

  protected readonly screenshotCallouts: ScreenshotCallout[] = [
    { x: 30, y: 30 },
    { x: 65, y: 60 },
  ];
}
