import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { OnThisPageComponent, PageSection } from './on-this-page';

describe('OnThisPageComponent', () => {
  let fixture: ComponentFixture<OnThisPageComponent>;
  let element: HTMLElement;

  const sections: PageSection[] = [
    { id: 'ticket', heading: '[Section one]' },
    { id: 'before', heading: '[Section two]' },
    { id: 'after', heading: '[Section three]' },
  ];

  const nav = () => element.querySelector('nav')!;
  const toggle = () => element.querySelector<HTMLButtonElement>('button')!;
  const list = () =>
    element.querySelector<HTMLElement>(`#${toggle().getAttribute('aria-controls')}`);
  const links = () => Array.from(element.querySelectorAll<HTMLAnchorElement>('nav a'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnThisPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(NgbConfig).animation = false;
    fixture = TestBed.createComponent(OnThisPageComponent);
    fixture.componentRef.setInput('sections', sections);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  describe('navigation landmark', () => {
    it('is a nav labelled "On this page" by its visible label', () => {
      const labelId = nav().getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      expect(element.querySelector(`#${labelId}`)?.textContent?.trim()).toBe('On this page');
    });

    it('shows the label only at xl and up', () => {
      const label = element.querySelector(`#${nav().getAttribute('aria-labelledby')}`)!;
      expect(label.classList).toContain('d-none');
      expect(label.classList).toContain('d-xl-block');
    });

    it('gives each instance unique ids', async () => {
      const second = TestBed.createComponent(OnThisPageComponent);
      second.componentRef.setInput('sections', sections);
      await second.whenStable();
      const secondNav = (second.nativeElement as HTMLElement).querySelector('nav')!;
      expect(secondNav.getAttribute('aria-labelledby')).not.toBe(
        nav().getAttribute('aria-labelledby'),
      );
      const secondButton = (second.nativeElement as HTMLElement).querySelector('button')!;
      expect(secondButton.getAttribute('aria-controls')).not.toBe(
        toggle().getAttribute('aria-controls'),
      );
    });
  });

  describe('links', () => {
    it('renders one link per section, in order, with the heading as its text', () => {
      expect(links().map((link) => link.textContent?.trim())).toEqual([
        '[Section one]',
        '[Section two]',
        '[Section three]',
      ]);
    });

    it('links each item to its section id as a fragment', () => {
      expect(links().map((link) => link.getAttribute('href'))).toEqual([
        '/#ticket',
        '/#before',
        '/#after',
      ]);
    });

    it('updates when the sections change', async () => {
      fixture.componentRef.setInput('sections', [{ id: 'tests', heading: '[Only section]' }]);
      await fixture.whenStable();
      expect(links()).toHaveLength(1);
      expect(links()[0].getAttribute('href')).toBe('/#tests');
    });
  });

  describe('toggle below xl', () => {
    it('is a real button, hidden at xl and up', () => {
      expect(toggle().type).toBe('button');
      expect(toggle().textContent?.trim()).toBe('On this page');
      expect(toggle().classList).toContain('d-xl-none');
    });

    it('starts collapsed, with aria-expanded="false" pointing at the list', () => {
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(list()).not.toBeNull();
      expect(list()!.classList).toContain('collapse');
      expect(list()!.classList).not.toContain('show');
    });

    it('keeps the list visible at xl and up even when collapsed', () => {
      expect(list()!.classList).toContain('d-xl-block');
    });

    it('expands and collapses the list', async () => {
      toggle().click();
      await fixture.whenStable();
      expect(toggle().getAttribute('aria-expanded')).toBe('true');
      expect(list()!.classList).toContain('show');

      toggle().click();
      await fixture.whenStable();
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(list()!.classList).not.toContain('show');
    });

    it('collapses the list after a link is chosen', async () => {
      toggle().click();
      await fixture.whenStable();
      links()[1].click();
      await fixture.whenStable();
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(list()!.classList).not.toContain('show');
    });

    it('hides the chevron icon from assistive technology', () => {
      const svg = toggle().querySelector('svg')!;
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.getAttribute('focusable')).toBe('false');
    });

    it('is focusable by keyboard', () => {
      toggle().focus();
      expect(document.activeElement).toBe(toggle());
    });
  });

  describe('axe', () => {
    it('has no violations when collapsed', async () => {
      await expectNoAxeViolations(element);
    });

    it('has no violations when expanded', async () => {
      toggle().click();
      await fixture.whenStable();
      await expectNoAxeViolations(element);
    });
  });
});
