# Build plan

Working notes for the ng-bootstrap for a11y documentation site: decisions made, ideas to build later, and open questions.

## Concept

A documentation site showing how to use ng-bootstrap to improve a site's accessibility (a11y). Each tutorial refactors existing code to use an ng-bootstrap component or directive and shows the accessibility gains.

The project's professional purpose is to showcase technical writing skills.

## Site structure

- **Home:** explains the project. Claude just create with "Coming soon..."
- **Side nav:** links to each tutorial. Setup and general tutorials above specific components etc.
- **Tutorials:** step-by-step instructions with screenshots, and videos later. No progress tracking. Claude only sets up template per CLAUDE.md. Should show status badge as "COMING SOON" or "UNDER CONSTRUCTION" as appropriate next to heading.

## Design decisions

| # | Decision | Choice | Status |
|---|----------|--------|--------|
| 1 | Screens to mock up | Home, tutorial template, phone view of a tutorial, style and writing-conventions sheet | Decided |
| 2 | Page layout | Top header, left side nav, content. Tutorial pages add an "On this page" list on the right. | Decided |
| 3 | Color and type | Deep violet palette, mapped to Bootstrap Sass variables (below). Bootstrap's default system font stack. | Decided |
| 4 | Tutorial structure | Ticket-based refactor (see [Tutorial template](#tutorial-template)) | Decided |
| 5 | Placeholders and writing notes in mockups | Outline boxes with bracketed prompts, plus switchable writing-convention notes and Bootstrap class labels. Interface labels use real wording. Claude will not write any documentation or user-facing prose, per CLAUDE.md | Decided |
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
| `$body-secondary-color` | `#5B5670` | Secondary text | 7.0:1 |
| `$info` | `#0F766E` | "Tip" callouts | 5.5:1 |
| `$body-tertiary-bg` | `#F7F5FC` | Side nav, code panels | Surface |

### Focus ring override

Bootstrap's default focus ring is `$primary` at 25% opacity, about 1.5:1 against white. That fails [WCAG 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), which requires 3:1. Implemented in `src/styles.scss`: `$focus-ring-width: 0` turns off Bootstrap's ring, and a global `:focus-visible` rule draws a two-tone indicator instead. It is a 3px `$primary` outline with a 2px white gap, so it stays visible on both light and dark backgrounds.

> Possible tutorial idea: fixing Bootstrap's default focus ring.

## Tutorial template

Every tutorial frames a refactor as a ticket.

1. **Ticket:** a mock work ticket with a summary, acceptance criteria, and links to the relevant ng-bootstrap docs and WCAG success criteria. Use a generic ticket design, not a copy of Jira's branding.
2. **Current implementation:** a working example of the code before the refactor. A button opens the code files in tabs, similar to the ng-bootstrap docs.
3. **Manual a11y testing (before):** a demonstration of manual testing that exposes the issues. Lists issues and conatins embedded video (will do later - for now show "Screen recording coming soon...").
4. **"Unboxing":** the accessibility improvements you get just by using the ng-bootstrap component/directive with its defaults.
5. **Refactor, step by step:** with screenshots. Draws attention to what you must add beyond what comes in the box.
   - **WATCH OUT** icons appear throughout. Each opens a popup about a common mistake.
6. **Final implementation:** a working example of the finished code, with the same button for viewing code.
7. **Automated tests.**
8. **Manual a11y testing (after):** demonstrates that the acceptance criteria and WCAG standards are met. Shows table of how a11y issues were addressed and contains embedded video (will do later - for now show "Screen recording coming soon...")

### Component ideas (dogfooding ng-bootstrap)

- Tabbed code viewer: `ngbNav`
- WATCH OUT dialogs: `ngbPopover`
- Icon-only buttons in the site header (theme toggle, source link): `ngbTooltip` plus `aria-label`, the same pattern as tutorial 1.

## Planned tutorials

1. **Accessible tooltips for icon-only buttons:** the first tutorial.
2. **Adding Bootstrap and ng-bootstrap to an Angular project:** installation, imports and setup.
3. **Manual a11y testing:** NVDA, JAWS, keyboard navigation, axe DevTools and similar tools.

## Build steps

Claude's task list. One commit per step.

### Decisions needed before Phase 3

- [ ] Where tutorial text lives: Angular templates, or Markdown files rendered into pages
- [ ] Watch out dialog: `ngbPopover` (this file) or `NgbModal` (DESIGN.md)
- [ ] Header theme toggle: build dark mode now, later, or drop the toggle
- [ ] Code syntax highlighting library, or none
- [ ] Hosting and deploy target

### Phase 0: Clean up and tooling

- [ ] 0.1 Remove the Angular starter template from `app.html` and `app.scss`
- [ ] 0.2 Swap explanatory comments in `src/styles.scss` for `[Comment: …]` placeholders (CLAUDE.md Rule 1)
- [ ] 0.3 Add `axe-core` and a shared axe test helper for Vitest
- [ ] 0.4 Add an `npm run lint` script (Angular ESLint with template a11y rules)

### Phase 1: App shell

- [ ] 1.1 Nav data file: groups (Overview, Foundations, Refactors), routes, titles, status
- [ ] 1.2 Routes for every nav item, with page titles through a `TitleStrategy`
- [ ] 1.3 Layout: header, left side nav, `<main>`, footer
- [ ] 1.4 Skip link to `<main>`
- [ ] 1.5 Side nav: `.nav-pills .flex-column`, `routerLinkActive`, `aria-current="page"`
- [ ] 1.6 Below `lg`: side nav in `NgbOffcanvas`, with an "Open navigation" button
- [ ] 1.7 Header icon buttons with `aria-label` and `ngbTooltip` (source link; theme toggle pending decision)
- [ ] 1.8 Focus and scroll on route change: move focus to the page `<h1>`, scroll to top, support `#anchor` links
- [ ] 1.9 Not found page
- [ ] 1.10 Tests: shell renders, skip link, offcanvas open/close and focus return, axe on each breakpoint

### Phase 2: Overview pages

- [ ] 2.1 Home: heading plus "Coming soon..."
- [ ] 2.2 About this project, How tutorials work, Writing conventions: heading plus placeholders
- [ ] 2.3 Tests: one per page, axe included

### Phase 3: Tutorial building blocks

- [ ] 3.1 Status badge: "COMING SOON" / "UNDER CONSTRUCTION", text plus color
- [ ] 3.2 Tutorial page layout: `<h1>` with badge, eight section slots, previous/next links
- [ ] 3.3 "On this page" list built from section headings; `ngbCollapse` toggle below `xl`
- [ ] 3.4 Ticket component: summary, acceptance criteria, ng-bootstrap doc links, WCAG links (generic design)
- [ ] 3.5 Live example frame for before/after demos
- [ ] 3.6 Code viewer: "View code" toggle (`ngbCollapse`), file tabs (`ngbNav`), "Copy code" button, horizontal scroll
- [ ] 3.7 Watch out button (`.btn-warning .rounded-pill`, text label) and dialog
- [ ] 3.8 Callouts: Note, Tip, result (`.alert-primary`, `.alert-info`, `.alert-success`)
- [ ] 3.9 Pass/fail badge with icon and word
- [ ] 3.10 Test results table in `.table-responsive`
- [ ] 3.11 Screenshot figure: `figure.figure`, numbered callouts, caption slot, `[Alt text: …]` input
- [ ] 3.12 Video slot showing "Screen recording coming soon..."
- [ ] 3.13 Tests for each block: keyboard behavior, ARIA states, axe

### Phase 4: Tutorial pages

- [ ] 4.1 Tutorial 1 page from the template, all sections as placeholders, status badge
- [ ] 4.2 Tutorial 1 "before" example: icon-only buttons with no accessible name or tooltip
- [ ] 4.3 Tutorial 1 "after" example: same buttons with `aria-label` and `ngbTooltip`
- [ ] 4.4 Tutorial 1 example source files wired into the code viewer
- [ ] 4.5 Tutorial 1 automated tests shown in section 7 (real, passing specs)
- [ ] 4.6 Tutorials 2 and 3: pages from the template, placeholders, status badges

### Phase 5: Check and ship

- [ ] 5.1 Run the `a11y-review` skill across the whole site; fix findings
- [ ] 5.2 Manual keyboard pass at phone, tablet, and desktop widths
- [ ] 5.3 Compare each screen with the mockups; list differences for the owner
- [ ] 5.4 Production build and deploy setup (pending decision)
- [ ] 5.5 List every placeholder the owner needs to fill, by page

## Open questions
