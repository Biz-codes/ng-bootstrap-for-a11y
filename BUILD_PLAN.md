# Build plan

Working notes for the ng-bootstrap for a11y documentation site: decisions made, ideas to build later, and open questions.

## Concept

A documentation site showing how to use ng-bootstrap to improve a site's accessibility (a11y). Each tutorial refactors existing code to use an ng-bootstrap component or directive and shows the accessibility gains.

The project's professional purpose is to showcase technical writing skills.

## Site structure

- **Home:** explains the project.
- **Side nav:** links to each tutorial.
- **Tutorials:** step-by-step instructions with screenshots, and videos later. No progress tracking.

## Design decisions

| # | Decision | Choice | Status |
|---|----------|--------|--------|
| 1 | Screens to mock up | Home, tutorial template, phone view of a tutorial, style and writing-conventions sheet | Decided |
| 2 | Page layout | Top header, left side nav, content. Tutorial pages add an "On this page" list on the right. | Decided |
| 3 | Color and type | Deep violet palette, mapped to Bootstrap Sass variables (below). Bootstrap's default system font stack. | Decided |
| 4 | Tutorial structure | Ticket-based refactor (see [Tutorial template](#tutorial-template)) | Decided |
| 5 | Placeholders and writing notes in mockups | Outline boxes with bracketed prompts, plus switchable writing-convention notes and Bootstrap class labels. Interface labels use real wording. | Decided |
| 6 | Phone behavior | Below `lg`, the side nav moves into an `NgbOffcanvas` slide-out panel. Below `xl`, "On this page" becomes an `ngbCollapse` toggle. The ticket stacks, and code and tables scroll sideways inside their boxes. | Decided |

### Styling rules

- Use Bootstrap classes everywhere. Prefer utility classes wherever possible.
- Theme through Bootstrap Sass variables, not custom CSS.

### Deep violet palette

| Token | Hex | Use | Contrast on white |
|-------|-----|-----|-------------------|
| `$primary` | `#5B21B6` | Buttons, links, focus ring | 9.0:1 |
| `$primary-text-emphasis` | `#4C1D95` | Hover and pressed states, emphasis text | 11.0:1 |
| `$primary-bg-subtle` | `#EDE9FE` | Subtle backgrounds (active nav item, callouts) | `$primary` on it: 7.6:1 |
| `$body-color` | `#1F1A2E` | Body text | 16.9:1 |
| `$secondary-color` | `#5B5670` | Secondary text | 7.0:1 |
| `$info` | `#0F766E` | "Tip" callouts | 5.5:1 |
| `$body-tertiary-bg` | `#F7F5FC` | Side nav, code panels | Surface |

### Focus ring override

Bootstrap's default focus ring is `$primary` at 25% opacity, about 1.5:1 against white. That fails [WCAG 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), which requires 3:1. Implemented in `src/styles.scss`: `$focus-ring-width: 0` turns off Bootstrap's ring, and a global `:focus-visible` rule draws a two-tone indicator instead. It is a 3px `$primary` outline with a 2px white gap, so it stays visible on both light and dark backgrounds.

> Possible tutorial idea: fixing Bootstrap's default focus ring.

## Tutorial template

Every tutorial frames a refactor as a ticket.

1. **Ticket:** a mock work ticket with a summary, acceptance criteria, and links to the relevant ng-bootstrap docs and WCAG success criteria. Use a generic ticket design, not a copy of Jira's branding.
2. **Current implementation:** a working example of the code before the refactor. A button opens the code files in tabs, similar to the ng-bootstrap docs.
3. **Manual a11y testing (before):** a demonstration of manual testing that exposes the issues.
4. **"Unboxing":** the accessibility improvements you get just by using the directive with its defaults.
5. **Refactor, step by step:** with screenshots. Draws attention to what you must add beyond what comes in the box.
   - **WATCH OUT** icons appear throughout. Each opens a dialog about a common mistake.
6. **Final implementation:** a working example of the finished code, with the same button for viewing code.
7. **Automated tests.**
8. **Manual a11y testing (after):** demonstrates that the acceptance criteria and WCAG standards are met.

### Component ideas (dogfooding ng-bootstrap)

- Tabbed code viewer: `ngbNav`
- WATCH OUT dialogs: `NgbModal`, or `ngbPopover` for shorter notes. Decide which.
- Icon-only buttons in the site header (theme toggle, source link): `ngbTooltip` plus `aria-label`, the same pattern as tutorial 1.

## Planned tutorials

1. **Accessible tooltips for icon-only buttons:** the first tutorial.
2. **Adding Bootstrap and ng-bootstrap to an Angular project:** installation, imports and setup.
3. **Manual a11y testing:** NVDA, JAWS, keyboard navigation, axe DevTools and similar tools.

## Open questions

- Should the setup tutorial (2) come first in the nav, since the others depend on it?
- WATCH OUT dialogs: modal or popover?
- Where to host the videos, and how to provide captions and transcripts.
