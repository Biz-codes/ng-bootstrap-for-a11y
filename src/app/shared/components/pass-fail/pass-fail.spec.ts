import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { PassFail, PassFailBadgeComponent } from './pass-fail';

describe('PassFailBadgeComponent', () => {
  let fixture: ComponentFixture<PassFailBadgeComponent>;
  let element: HTMLElement;

  const badge = () => element.querySelector<HTMLElement>('.badge')!;

  async function render(result: PassFail): Promise<void> {
    fixture.componentRef.setInput('result', result);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PassFailBadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(PassFailBadgeComponent);
    element = fixture.nativeElement;
  });

  const cases: { result: PassFail; word: string; color: string; iconShape: string }[] = [
    { result: 'pass', word: 'Pass', color: 'success', iconShape: 'polyline' },
    { result: 'fail', word: 'Fail', color: 'danger', iconShape: 'line' },
  ];

  for (const { result, word, color, iconShape } of cases) {
    describe(result, () => {
      beforeEach(() => render(result));

      it(`shows the word "${word}", so color is never the only signal`, () => {
        expect(badge().textContent?.trim()).toBe(word);
      });

      it(`uses the ${color} subtle colors`, () => {
        expect(badge().classList).toContain('badge');
        expect(badge().classList).toContain(`bg-${color}-subtle`);
        expect(badge().classList).toContain(`text-${color}-emphasis`);
      });

      it('pairs the word with a decorative icon', () => {
        const svg = badge().querySelector('svg')!;
        expect(svg.querySelector(iconShape)).not.toBeNull();
        expect(svg.getAttribute('aria-hidden')).toBe('true');
        expect(svg.getAttribute('focusable')).toBe('false');
      });

      it('has no axe violations', async () => {
        await expectNoAxeViolations(element);
      });
    });
  }

  it('switches between pass and fail', async () => {
    await render('fail');
    await render('pass');
    expect(badge().textContent?.trim()).toBe('Pass');
    expect(element.querySelectorAll('.badge')).toHaveLength(1);
  });
});
