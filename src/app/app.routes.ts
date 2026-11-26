import { Routes } from '@angular/router';

const devRoutes: Routes =
  typeof ngDevMode === 'undefined' || ngDevMode
    ? [
        {
          path: 'dev/components',
          title: 'Component demo',
          loadComponent: () =>
            import('./dev/component-demo/component-demo').then((m) => m.ComponentDemoComponent),
        },
      ]
    : [];

export const routes: Routes = [...devRoutes];
