import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbConfig, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { expectNoAxeViolations } from '../../../../testing/axe';
import { CodeFile } from '../code-viewer/code-viewer';
import { WorkingExampleComponent } from './working-example';

@Component({
  imports: [WorkingExampleComponent, NgbTooltip],
  template: `
    <app-working-example [label]="label()" [files]="files()">
      <button type="button" class="btn btn-outline-secondary demo" ngbTooltip="[Tooltip]">
        [Demo button]
      </button>
    </app-working-example>
  `,
})
class HostComponent {
  readonly label = signal('[Example label]');
  readonly files = signal<CodeFile[]>([
    { name: 'demo.html', language: 'xml', code: '<button type="button">[Demo]</button>' },
  ]);
}

describe('WorkingExampleComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  const frame = () => element.querySelector<HTMLElement>('.card')!;
  const stage = () => element.querySelector<HTMLElement>('.card-body')!;
  const codeViewer = () => element.querySelector<HTMLElement>('app-code-viewer');

  async function render(): Promise<void> {
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    TestBed.inject(NgbConfig).animation = false;
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await render();
  });

  afterEach(() => {
    document.querySelectorAll('ngb-tooltip-window').forEach((tooltip) => tooltip.remove());
  });

  it('is a group named by its visible label', () => {
    expect(frame().getAttribute('role')).toBe('group');
    const label = element.querySelector(`#${frame().getAttribute('aria-labelledby')}`);
    expect(label?.textContent?.trim()).toBe('[Example label]');
    expect(label?.closest('.card-header')).not.toBeNull();
  });

  it('updates the label', async () => {
    host.label.set('[New label]');
    await render();
    expect(
      element.querySelector(`#${frame().getAttribute('aria-labelledby')}`)?.textContent?.trim(),
    ).toBe('[New label]');
  });

  it('projects the live demo onto the tertiary background', () => {
    expect(stage().classList).toContain('bg-body-tertiary');
    expect(stage().querySelector('.demo')?.textContent?.trim()).toBe('[Demo button]');
  });

  it('shows the code viewer below the demo with the files', () => {
    expect(codeViewer()).not.toBeNull();
    expect(
      stage().compareDocumentPosition(codeViewer()!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(codeViewer()!.textContent).toContain('View code');
  });

  it('leaves out the code viewer when there are no files', async () => {
    host.files.set([]);
    await render();
    expect(codeViewer()).toBeNull();
  });

  it('does not clip tooltips from the live demo', async () => {
    expect(frame().classList).not.toContain('overflow-hidden');
    expect(stage().classList).not.toContain('overflow-hidden');
    const demo = element.querySelector<HTMLButtonElement>('.demo')!;
    demo.dispatchEvent(new Event('mouseenter'));
    await render();
    const tooltip = document.querySelector('ngb-tooltip-window');
    expect(tooltip?.textContent?.trim()).toBe('[Tooltip]');
    expect(tooltip?.closest('.overflow-hidden')).toBeNull();
  });

  it('keeps the live demo keyboard reachable', () => {
    const demo = element.querySelector<HTMLButtonElement>('.demo')!;
    demo.focus();
    expect(document.activeElement).toBe(demo);
  });

  it('gives each instance a unique label id', async () => {
    const second = TestBed.createComponent(HostComponent);
    await second.whenStable();
    const secondFrame = (second.nativeElement as HTMLElement).querySelector('.card')!;
    expect(secondFrame.getAttribute('aria-labelledby')).not.toBe(
      frame().getAttribute('aria-labelledby'),
    );
  });

  describe('axe', () => {
    it('has no violations with the code collapsed', async () => {
      await expectNoAxeViolations(element);
    });

    it('has no violations with the code expanded', async () => {
      codeViewer()!.querySelector<HTMLButtonElement>('button[aria-controls]')!.click();
      await render();
      await expectNoAxeViolations(element);
    });

    it('has no violations without code', async () => {
      host.files.set([]);
      await render();
      await expectNoAxeViolations(element);
    });
  });
});
