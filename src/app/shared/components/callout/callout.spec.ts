import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { CalloutComponent, CalloutType } from './callout';

@Component({
  imports: [CalloutComponent],
  template: `<app-callout [type]="type()"><span class="body">[Callout text]</span></app-callout>`,
})
class HostComponent {
  readonly type = signal<CalloutType>('note');
}

describe('CalloutComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  const alert = () => element.querySelector<HTMLElement>('.alert')!;

  async function render(type: CalloutType): Promise<void> {
    host.type.set(type);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  const cases: { type: CalloutType; label: string; alertClass: string; icon: boolean }[] = [
    { type: 'note', label: 'Note:', alertClass: 'alert-primary', icon: false },
    { type: 'tip', label: 'Tip:', alertClass: 'alert-info', icon: false },
    { type: 'result', label: 'You should now see:', alertClass: 'alert-success', icon: true },
  ];

  for (const { type, label, alertClass, icon } of cases) {
    describe(type, () => {
      beforeEach(() => render(type));

      it(`uses ${alertClass}`, () => {
        expect(alert().classList).toContain('alert');
        expect(alert().classList).toContain(alertClass);
      });

      it(`starts with a bold "${label}" label, then the projected text`, () => {
        expect(alert().querySelector('strong')?.textContent).toBe(label);
        expect(alert().textContent?.replace(/\s+/g, ' ').trim()).toBe(`${label} [Callout text]`);
      });

      it(icon ? 'shows a decorative check icon' : 'shows no icon', () => {
        const svg = alert().querySelector('svg');
        if (icon) {
          expect(svg?.getAttribute('aria-hidden')).toBe('true');
          expect(svg?.getAttribute('focusable')).toBe('false');
        } else {
          expect(svg).toBeNull();
        }
      });

      it('is static content, not a live alert', () => {
        expect(alert().getAttribute('role')).toBeNull();
        expect(alert().getAttribute('aria-live')).toBeNull();
      });

      it('has no axe violations', async () => {
        await expectNoAxeViolations(element);
      });
    });
  }

  it('updates the label and color when the type changes', async () => {
    await render('note');
    await render('tip');
    expect(alert().classList).toContain('alert-info');
    expect(alert().classList).not.toContain('alert-primary');
    expect(alert().querySelector('strong')?.textContent).toBe('Tip:');
  });
});
