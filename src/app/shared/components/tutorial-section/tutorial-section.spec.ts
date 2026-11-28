import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { TutorialSectionComponent } from './tutorial-section';

@Component({
  imports: [TutorialSectionComponent],
  template: `
    <app-tutorial-section id="ticket" heading="[Static heading]" [number]="1">
      <p class="projected">[Section content]</p>
    </app-tutorial-section>
    <app-tutorial-section [id]="id()" [heading]="heading()" [number]="number()">
      <p>[Section content]</p>
    </app-tutorial-section>
  `,
})
class HostComponent {
  readonly id = signal('before');
  readonly heading = signal('[Bound heading]');
  readonly number = signal<number | undefined>(undefined);
}

describe('TutorialSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  function sections(): HTMLElement[] {
    return Array.from(element.querySelectorAll('section'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('renders a section with an h2 holding the heading', () => {
    const [first] = sections();
    const h2 = first.querySelector('h2');
    expect(h2?.textContent?.trim()).toBe('[Static heading]');
  });

  it('puts the id on the section, not the host element', () => {
    const [first, second] = sections();
    expect(first.id).toBe('ticket');
    expect(second.id).toBe('before');
    for (const hostElement of Array.from(element.querySelectorAll('app-tutorial-section'))) {
      expect(hostElement.hasAttribute('id')).toBe(false);
    }
    expect(element.querySelectorAll('#ticket')).toHaveLength(1);
  });

  it('updates the id and heading when the inputs change', async () => {
    host.id.set('after');
    host.heading.set('[New heading]');
    await fixture.whenStable();
    const second = sections()[1];
    expect(second.id).toBe('after');
    expect(second.querySelector('h2')?.textContent?.trim()).toBe('[New heading]');
  });

  it('shows the number before the h2, outside it', () => {
    const [first] = sections();
    const h2 = first.querySelector('h2')!;
    const number = h2.previousElementSibling;
    expect(number?.textContent?.trim()).toBe('1');
    expect(number?.classList).toContain('text-primary');
    expect(h2.textContent).not.toContain('1');
  });

  it('shows no number without one, and adds it when set', async () => {
    const second = sections()[1];
    expect(second.querySelector('h2')?.previousElementSibling).toBeNull();
    host.number.set(6);
    await fixture.whenStable();
    expect(second.querySelector('h2')?.previousElementSibling?.textContent?.trim()).toBe('6');
  });

  it('projects content after the heading', () => {
    const [first] = sections();
    const projected = first.querySelector('.projected');
    expect(projected?.textContent).toBe('[Section content]');
    const h2 = first.querySelector('h2')!;
    expect(h2.compareDocumentPosition(projected!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('does not make the section a landmark', () => {
    for (const section of sections()) {
      expect(section.hasAttribute('aria-label')).toBe(false);
      expect(section.hasAttribute('aria-labelledby')).toBe(false);
    }
  });

  it('has no axe violations, with and without a number', async () => {
    await expectNoAxeViolations(element);
    host.number.set(2);
    await fixture.whenStable();
    await expectNoAxeViolations(element);
  });
});
