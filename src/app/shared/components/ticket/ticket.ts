import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface TicketCriterion {
  id: string;
  text: string;
}

export interface TicketLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-ticket',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket.html',
})
export class TicketComponent {
  readonly ticketId = input.required<string>();
  readonly type = input.required<string>();
  readonly status = input.required<string>();
  readonly criteria = input<readonly TicketCriterion[]>([]);
  readonly ngbLinks = input<readonly TicketLink[]>([]);
  readonly wcagLinks = input<readonly TicketLink[]>([]);
  readonly component = input<string>();
  readonly labels = input<readonly string[]>([]);
}
