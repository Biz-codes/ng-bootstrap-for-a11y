import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { TicketComponent, TicketCriterion, TicketLink } from './ticket';

@Component({
  imports: [TicketComponent],
  template: `
    <app-ticket
      ticketId="A11Y-1"
      type="[Type]"
      status="[Status]"
      [criteria]="criteria()"
      [ngbLinks]="ngbLinks()"
      [wcagLinks]="wcagLinks()"
      [component]="component()"
      [labels]="labels()"
    >
      <span ticketSummary class="summary">[Summary]</span>
      <p ticketDescription class="description mb-0">[Description]</p>
      <p class="unslotted">[Not in a slot]</p>
    </app-ticket>
  `,
})
class HostComponent {
  readonly criteria = signal<TicketCriterion[]>([
    { id: 'AC1', text: '[Criterion one]' },
    { id: 'AC2', text: '[Criterion two]' },
  ]);
  readonly ngbLinks = signal<TicketLink[]>([
    { label: '[ng-bootstrap link]', href: 'https://ng-bootstrap.github.io/#/components/tooltip' },
  ]);
  readonly wcagLinks = signal<TicketLink[]>([
    { label: '[WCAG link]', href: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html' },
  ]);
  readonly component = signal<string | undefined>('[Component]');
  readonly labels = signal<string[]>(['[label one]', '[label two]']);
}

describe('TicketComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  const article = () => element.querySelector('article')!;
  const header = () => element.querySelector('.card-header')!;
  const terms = () =>
    Array.from(element.querySelectorAll('dt')).map((dt) => dt.textContent?.trim());
  const definitionFor = (term: string) =>
    Array.from(element.querySelectorAll('dt')).find((dt) => dt.textContent?.trim() === term)
      ?.nextElementSibling as HTMLElement | undefined;

  async function render(): Promise<void> {
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await render();
  });

  describe('card and header', () => {
    it('is an article card named after the ticket id', () => {
      expect(article().classList).toContain('card');
      expect(article().getAttribute('aria-label')).toBe('Ticket A11Y-1');
    });

    it('shows the type, id, and status in the card header', () => {
      expect(header().textContent).toContain('[Type]');
      expect(header().querySelector('code')?.textContent?.trim()).toBe('A11Y-1');
      const status = header().querySelector('.badge')!;
      expect(status.textContent?.trim()).toBe('[Status]');
      expect(status.classList).toContain('text-uppercase');
    });

    it('hides every decorative icon from assistive technology', () => {
      for (const svg of Array.from(element.querySelectorAll('svg'))) {
        expect(svg.getAttribute('aria-hidden')).toBe('true');
        expect(svg.getAttribute('focusable')).toBe('false');
      }
    });
  });

  describe('main fields', () => {
    it('projects the summary and description into their fields', () => {
      expect(definitionFor('Summary')?.querySelector('.summary')?.textContent).toBe('[Summary]');
      expect(definitionFor('Description')?.querySelector('.description')?.textContent).toBe(
        '[Description]',
      );
    });

    it('drops content that is not in a slot', () => {
      expect(element.querySelector('.unslotted')).toBeNull();
    });

    it('lists each acceptance criterion with its id', () => {
      const items = Array.from(definitionFor('Acceptance criteria')!.querySelectorAll('li'));
      expect(items.map((li) => li.querySelector('strong')?.textContent)).toEqual(['AC1', 'AC2']);
      expect(items[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('AC1 [Criterion one]');
      expect(items[0].classList).toContain('list-group-item');
    });

    it('omits the criteria field when there are none', async () => {
      host.criteria.set([]);
      await render();
      expect(terms()).not.toContain('Acceptance criteria');
    });
  });

  describe('side fields', () => {
    it('shows the component and labels', () => {
      expect(definitionFor('Component')?.textContent?.trim()).toBe('[Component]');
      const labels = Array.from(definitionFor('Labels')!.querySelectorAll('li'));
      expect(labels.map((li) => li.textContent?.trim())).toEqual(['[label one]', '[label two]']);
      expect(labels[0].classList).toContain('badge');
    });

    it('lists ng-bootstrap links before WCAG links under one Links field', () => {
      const links = Array.from(definitionFor('Links')!.querySelectorAll('a'));
      expect(links.map((a) => a.textContent?.trim())).toEqual([
        '[ng-bootstrap link]',
        '[WCAG link]',
      ]);
      expect(links[0].getAttribute('href')).toBe(
        'https://ng-bootstrap.github.io/#/components/tooltip',
      );
    });

    it('omits empty side fields', async () => {
      host.component.set(undefined);
      host.labels.set([]);
      host.ngbLinks.set([]);
      host.wcagLinks.set([]);
      await render();
      expect(terms()).toEqual(['Summary', 'Description', 'Acceptance criteria']);
    });

    it('stacks the side fields under the main fields below md', () => {
      const body = article().querySelector('.card-header + div')!;
      expect(body.classList).toContain('flex-column');
      expect(body.classList).toContain('flex-md-row');
      const lists = body.querySelectorAll(':scope > dl');
      expect(lists).toHaveLength(2);
      expect(lists[0].textContent).toContain('Summary');
      expect(lists[1].textContent).toContain('Links');
    });

    it('uses a horizontal rule below md and a vertical rule from md up', () => {
      expect(element.querySelector('hr')?.classList).toContain('d-md-none');
      const rule = element.querySelector('.vr')!;
      expect(rule.classList).toContain('d-none');
      expect(rule.classList).toContain('d-md-block');
    });
  });

  describe('keyboard', () => {
    it('makes every link focusable', () => {
      for (const link of Array.from(element.querySelectorAll('a'))) {
        link.focus();
        expect(document.activeElement).toBe(link);
      }
    });
  });

  describe('axe', () => {
    it('has no violations with every field', async () => {
      await expectNoAxeViolations(element);
    });

    it('has no violations with only the required fields', async () => {
      host.criteria.set([]);
      host.component.set(undefined);
      host.labels.set([]);
      host.ngbLinks.set([]);
      host.wcagLinks.set([]);
      await render();
      await expectNoAxeViolations(element);
    });
  });
});
