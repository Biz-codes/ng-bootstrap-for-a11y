import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { Status, StatusBadgeComponent } from './status-badge';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;

  async function render(status: Status): Promise<HTMLElement> {
    fixture.componentRef.setInput('status', status);
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('.badge');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StatusBadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(StatusBadgeComponent);
  });

  const cases: { status: Status; label: string; color: string }[] = [
    { status: 'coming-soon', label: 'Coming soon', color: 'secondary' },
    { status: 'under-construction', label: 'Under construction', color: 'warning' },
  ];

  for (const { status, label, color } of cases) {
    describe(status, () => {
      it(`shows the text "${label}"`, async () => {
        const badge = await render(status);
        expect(badge.textContent?.trim()).toBe(label);
      });

      it(`uses the ${color} subtle colors`, async () => {
        const badge = await render(status);
        expect(badge.classList).toContain(`bg-${color}-subtle`);
        expect(badge.classList).toContain(`text-${color}-emphasis`);
        expect(badge.classList).toContain(`border-${color}-subtle`);
      });

      it('keeps the base badge classes', async () => {
        const badge = await render(status);
        expect(badge.classList).toContain('badge');
        expect(badge.classList).toContain('text-uppercase');
      });

      it('has no axe violations', async () => {
        await render(status);
        await expectNoAxeViolations(fixture.nativeElement);
      });
    });
  }

  it('updates the text and colors when the status changes', async () => {
    await render('coming-soon');
    const badge = await render('under-construction');
    expect(badge.textContent?.trim()).toBe('Under construction');
    expect(badge.classList).toContain('bg-warning-subtle');
    expect(badge.classList).not.toContain('bg-secondary-subtle');
  });
});
