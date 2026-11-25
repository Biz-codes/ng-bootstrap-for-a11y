import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgbCollapse, NgbNavModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { highlight } from './highlight';

export interface CodeFile {
  name: string;
  language: string;
  code: string;
}

type CopyState = 'idle' | 'copied' | 'failed';

let nextId = 0;

@Component({
  selector: 'app-code-viewer',
  imports: [NgbCollapse, NgbNavModule, NgbTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-viewer.html',
})
export class CodeViewerComponent {
  readonly files = input.required<readonly CodeFile[]>();

  protected readonly panelId = `code-viewer-${nextId++}`;
  protected readonly collapsed = signal(true);
  protected readonly activeIndex = signal(0);
  protected readonly copyState = signal<CopyState>('idle');

  protected readonly highlightedFiles = computed(() =>
    this.files().map((file) => ({ ...file, html: highlight(file.code, file.language) })),
  );

  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected toggle(): void {
    this.collapsed.update((collapsed) => !collapsed);
  }

  protected selectFile(index: number): void {
    this.activeIndex.set(index);
    this.copyState.set('idle');
  }

  protected async copy(): Promise<void> {
    const file = this.files()[this.activeIndex()];
    if (!file) {
      return;
    }
    try {
      await navigator.clipboard.writeText(file.code);
      this.copyState.set('copied');
    } catch {
      this.copyState.set('failed');
    }
    clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copyState.set('idle'), 3000);
  }
}
