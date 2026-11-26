import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { expectNoAxeViolations } from '../../../testing/axe';
import { routes } from '../../app.routes';
import { ComponentDemoComponent } from './component-demo';

describe('ComponentDemoComponent', () => {
  let fixture: ComponentFixture<ComponentDemoComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentDemoComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(NgbConfig).animation = false;
    fixture = TestBed.createComponent(ComponentDemoComponent);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('is registered at /dev/components in dev builds', () => {
    const route = routes.find((candidate) => candidate.path === 'dev/components');
    expect(route?.title).toBe('Component demo');
    expect(route?.loadComponent).toBeDefined();
  });

  it('renders inside the tutorial layout with one h1', () => {
    const headings = element.querySelectorAll('h1');
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent?.trim()).toBe('Component demo');
  });

  it('renders every Phase 1 component', () => {
    const selectors = [
      'app-tutorial-layout',
      'app-tutorial-section',
      'app-on-this-page',
      'app-status-badge',
      'app-ticket',
      'app-working-example',
      'app-code-viewer',
      'app-watch-out',
      'app-callout',
      'app-pass-fail',
      'app-results-table',
      'app-screenshot',
      'app-video',
    ];
    for (const selector of selectors) {
      expect(element.querySelector(selector), selector).not.toBeNull();
    }
  });

  it('shows each status, callout type, and result', () => {
    const text = (selector: string) =>
      Array.from(element.querySelectorAll(selector)).map((node) => node.textContent?.trim());
    expect(text('section app-status-badge')).toEqual(['Coming soon', 'Under construction']);
    expect(text('app-callout strong')).toEqual(['Note:', 'Tip:', 'You should now see:']);
    expect(text('section > div > app-pass-fail')).toEqual(['Pass', 'Fail']);
  });

  it('lists every section in On this page', () => {
    const links = element.querySelectorAll('app-on-this-page a');
    expect(links).toHaveLength(element.querySelectorAll('app-tutorial-section').length);
  });

  it('has no axe violations', async () => {
    await expectNoAxeViolations(element);
  });
});
