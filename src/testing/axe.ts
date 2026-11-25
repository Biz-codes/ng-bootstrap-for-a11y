import axe, { type ElementContext, type Result, type RunOptions } from 'axe-core';

const defaultOptions: RunOptions = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
  rules: {
    'color-contrast': { enabled: false },
    region: { enabled: false },
  },
};

export async function runAxe(context: ElementContext, options: RunOptions = {}): Promise<Result[]> {
  const results = await axe.run(context, {
    ...defaultOptions,
    ...options,
    rules: { ...defaultOptions.rules, ...options.rules },
  });
  return results.violations;
}

export function formatViolations(violations: Result[]): string {
  return violations
    .map((violation) => {
      const targets = violation.nodes.map((node) => `    ${node.target.join(' ')}`).join('\n');
      return `[${violation.impact}] ${violation.id}: ${violation.help}\n  ${violation.helpUrl}\n${targets}`;
    })
    .join('\n\n');
}

export async function expectNoAxeViolations(context: ElementContext, options?: RunOptions): Promise<void> {
  const violations = await runAxe(context, options);
  expect(violations, formatViolations(violations)).toEqual([]);
}
