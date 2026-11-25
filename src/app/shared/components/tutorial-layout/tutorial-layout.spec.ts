import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { Status } from '../status-badge/status-badge';
import { TutorialLayoutComponent, TutorialLink } from './tutorial-layout';

@Component({
  imports: [TutorialLayoutComponent],
  template: `
    <app-tutorial-layout
      [title]="title()"
      [status]="status()"
      [previous]="previous()"
      [next]="next()"
    >
      <section id="first"><h2>[Section one]</h2></section>
      <section id="second"><h2>[Section two]</h2></section>
    </app-tutorial-layout>
  `,
})
class HostComponent {
  readonly title = signal('[Tutorial title]');
  readonly status = signal<Status | undefined>(undefined);
  readonly previous = signal<TutorialLink | undefined>(undefined);
  readonly next = signal<TutorialLink | undefined>(undefined);
}

describe('TutorialLayoutComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  const previous: TutorialLink = { title: '[Previous page]', link: '/previous' };
  const next: TutorialLink = { title: '[Next page]', link: ['/tutorials', 'next'] };

  async function render(): Promise<void> {
    await fixture.whenStable();
  }

  function pagination(): HTMLElement | null {
    return element.querySelector('nav[aria-label="Tutorial pagination"]');
  }

  function paginationLinks(): HTMLAnchorElement[] {
    return Array.from(pagination()?.querySelectorAll('a') ?? []);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  describe('heading', () => {
    it('renders the title as the only h1', async () => {
      await render();
      const headings = element.querySelectorAll('h1');
      expect(headings).toHaveLength(1);
      expect(headings[0].textContent?.trim()).toBe('[Tutorial title]');
    });

    it('updates the h1 when the title changes', async () => {
      await render();
      host.title.set('[Another title]');
      await render();
      expect(element.querySelector('h1')?.textContent?.trim()).toBe('[Another title]');
    });

    it('shows no status badge without a status', async () => {
      await render();
      expect(element.querySelector('app-status-badge')).toBeNull();
    });

    it('shows the status badge next to the h1, outside it', async () => {
      host.status.set('under-construction');
      await render();
      const badge = element.querySelector('app-status-badge');
      expect(badge?.textContent?.trim()).toBe('Under construction');
      expect(element.querySelector('h1')?.contains(badge)).toBe(false);
      expect(badge?.previousElementSibling?.tagName).toBe('H1');
    });
  });

  describe('projected sections', () => {
    it('renders projected content after the heading', async () => {
      await render();
      const sections = element.querySelectorAll('section');
      expect(Array.from(sections).map((s) => s.id)).toEqual(['first', 'second']);
      const h1 = element.querySelector('h1')!;
      expect(
        h1.compareDocumentPosition(sections[0]) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });
  });

  describe('pagination', () => {
    it('is not rendered without previous or next', async () => {
      await render();
      expect(pagination()).toBeNull();
    });

    it('renders both links in order with labels and titles', async () => {
      host.previous.set(previous);
      host.next.set(next);
      await render();
      const links = paginationLinks();
      expect(links).toHaveLength(2);
      expect(links[0].getAttribute('href')).toBe('/previous');
      expect(links[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('Previous: [Previous page]');
      expect(links[1].getAttribute('href')).toBe('/tutorials/next');
      expect(links[1].textContent?.replace(/\s+/g, ' ').trim()).toBe('Next: [Next page]');
    });

    it('renders only the previous link when there is no next', async () => {
      host.previous.set(previous);
      await render();
      const links = paginationLinks();
      expect(links).toHaveLength(1);
      expect(links[0].textContent).toContain('Previous');
    });

    it('keeps a lone next link in the right-hand column', async () => {
      host.next.set(next);
      await render();
      const links = paginationLinks();
      expect(links).toHaveLength(1);
      expect(links[0].textContent).toContain('Next');
      expect(links[0].parentElement?.classList).toContain('offset-md-6');
    });

    it('does not offset the next link when there is a previous link', async () => {
      host.previous.set(previous);
      host.next.set(next);
      await render();
      expect(paginationLinks()[1].parentElement?.classList).not.toContain('offset-md-6');
    });

    it('is reachable by keyboard: every link is focusable', async () => {
      host.previous.set(previous);
      host.next.set(next);
      await render();
      for (const link of paginationLinks()) {
        link.focus();
        expect(document.activeElement).toBe(link);
      }
    });
  });

  describe('axe', () => {
    it('has no violations with only a title', async () => {
      await render();
      await expectNoAxeViolations(element);
    });

    it('has no violations with a status and both links', async () => {
      host.status.set('coming-soon');
      host.previous.set(previous);
      host.next.set(next);
      await render();
      await expectNoAxeViolations(element);
    });
  });
});
