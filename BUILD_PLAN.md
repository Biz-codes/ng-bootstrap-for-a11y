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
| 7 | Where tutorial text lives | Angular templates | Decided |
| 8 | Watch out dialog | `ngbPopover` | Decided |
| 9 | Dark mode and header theme toggle | Later | Decided |
| 10 | Code syntax highlighting | Yes, with highlight.js | Decided |
| 11 | Hosting and deploy target | TBD | Open |

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

### Phase 0: Clean up and tooling

- [x] 0.1 Remove the Angular starter template from `app.html` and `app.scss`
- [x] 0.2 Add `axe-core` and a shared axe test helper for Vitest
- [x] 0.3 Add an `npm run lint` script (Angular ESLint with template a11y rules)
- [x] 0.4 Pre-commit hooks: lint and format staged files, run tests
- [x] 0.5 GitHub Actions workflow: lint, test, and build on every push and pull request

### Phase 1: Reusable components

Standalone components in `src/app/shared/components/`, each with its own spec (keyboard behavior, ARIA states, axe). Text comes from each page's template through inputs or content projection, never from inside the component.

| Step | Component | Selector | Built with | Takes |
|------|-----------|----------|------------|-------|
| 1.1 | `StatusBadgeComponent` | `app-status-badge` | `.badge`, text plus color | `status`: `coming-soon` \| `under-construction` |
| 1.2 | `TutorialLayoutComponent` | `app-tutorial-layout` | Grid, previous/next links | `title`, `status`, `previous`, `next`; projected sections |
| 1.3 | `TutorialSectionComponent` | `app-tutorial-section` | `<section>` with `<h2>` | `heading`, `id`; projected content |
| 1.4 | `OnThisPageComponent` | `app-on-this-page` | `.nav`, `ngbCollapse` below `xl` | Reads section headings from the layout |
| 1.5 | `TicketComponent` | `app-ticket` | `.card`, generic design | `ticketId`, `type`, `status`, `criteria` (`{ id, text }[]`), `ngbLinks` and `wcagLinks` (`{ label, href }[]`), `component`, `labels`; projected slots: `[ticketSummary]`, `[ticketDescription]` |
| 1.6 | `CodeViewerComponent` | `app-code-viewer` | `ngbCollapse` "View code" toggle, `ngbNav` file tabs, "Copy code" button, highlight.js (4.5:1 theme), sideways scroll | `files`: `{ name, language, code }[]` |
| 1.7 | `WorkingExampleComponent` | `app-working-example` | Bordered frame on `$body-tertiary-bg`, with `CodeViewerComponent` below | `label`, `files`; projected live demo |
| 1.8 | `WatchOutComponent` | `app-watch-out` | `.btn-warning .rounded-pill` with text label, `ngbPopover` | `title`; projected popover content |
| 1.9 | `CalloutComponent` | `app-callout` | `.alert-primary` / `.alert-info` / `.alert-success` | `type`: `note` \| `tip` \| `result`; projected content |
| 1.10 | `PassFailBadgeComponent` | `app-pass-fail` | `.badge` with icon and word | `result`: `pass` \| `fail` |
| 1.11 | `ResultsTableComponent` | `app-results-table` | `.table` in `.table-responsive`, `PassFailBadgeComponent` | `rows`; column headers as inputs |
| 1.12 | `ScreenshotComponent` | `app-screenshot` | `figure.figure`, numbered callouts | `src`, `alt` (`[Alt text: …]` until filled); projected caption |
| 1.13 | `VideoComponent` | `app-video` | Placeholder showing "Screen recording coming soon..." | `src` (optional), `title` |

One commit per component, in table order:

- [x] 1.1 `StatusBadgeComponent`
- [x] 1.2 `TutorialLayoutComponent`
- [x] 1.3 `TutorialSectionComponent`, plus heading sizes and weight in `src/styles.scss`
- [x] 1.4 `OnThisPageComponent`
- [x] 1.5 `TicketComponent`
- [x] 1.6 `CodeViewerComponent`
- [x] 1.7 `WorkingExampleComponent`
- [ ] 1.8 `WatchOutComponent`
- [ ] 1.9 `CalloutComponent`
- [ ] 1.10 `PassFailBadgeComponent`
- [ ] 1.11 `ResultsTableComponent`
- [ ] 1.12 `ScreenshotComponent`
- [ ] 1.13 `VideoComponent`
- [ ] 1.14 Demo route (dev builds only) showing every component in every state, for checking against the mockups

### Phase 2: App shell

- [ ] 2.1 Nav data file: groups (Overview, Foundations, Refactors), routes, titles, status
- [ ] 2.2 Routes for every nav item, with page titles through a `TitleStrategy`; keep the 1.14 demo route dev-only
- [ ] 2.3 Layout components in `src/app/layout/`: `HeaderComponent`, `SideNavComponent`, `FooterComponent`, with `<main>` in `App`
- [ ] 2.4 Skip link to `<main>`
- [ ] 2.5 `SideNavComponent`: `.nav-pills .flex-column`, `routerLinkActive`, `aria-current="page"`, built from the nav data file
- [ ] 2.6 Below `lg`: `SideNavComponent` in `NgbOffcanvas`, with an "Open navigation" button in `HeaderComponent`
- [ ] 2.7 `HeaderComponent` source link icon button with `aria-label` and `ngbTooltip`
- [ ] 2.8 Focus and scroll on route change: move focus to the page `<h1>`, scroll to top, support `#anchor` links (including links from `OnThisPageComponent`)
- [ ] 2.9 Not found page
- [ ] 2.10 Tests: shell renders, skip link, offcanvas open/close and focus return, axe on each breakpoint

### Phase 3: Overview pages

- [ ] 3.1 Home: heading plus "Coming soon..."
- [ ] 3.2 About this project, How tutorials work, Writing conventions: heading plus placeholders
- [ ] 3.3 Automated Testing: axe included
- [ ] 3.4 Manual Testing, with outline for keyboard navigation, screen reader, developer tools, etc.
- [ ] 3.5 `StatusBadgeComponent` next to the `<h1>` of any page that isn't finished
- [ ] 3.6 Tests: one spec per page, axe included

### Phase 4: Tutorial pages

Tutorial 1 is assembled from Phase 1 components, one commit per step:

- [ ] 4.1 Page: `TutorialLayoutComponent` with eight `TutorialSectionComponent`s, `StatusBadgeComponent`, `OnThisPageComponent`, previous/next links
- [ ] 4.2 Section 1, Ticket: `TicketComponent` with placeholder slots and real ng-bootstrap and WCAG links
- [ ] 4.3 "Before" example component: icon-only buttons with no accessible name or tooltip
- [ ] 4.4 Section 2, Current implementation: `WorkingExampleComponent` with the "before" example and its source files as `files`
- [ ] 4.5 Section 3, Manual testing (before): `ResultsTableComponent` with placeholder rows, `VideoComponent`
- [ ] 4.6 Section 4, Unboxing: placeholders, `CalloutComponent` where the mockup shows "In the box"
- [ ] 4.7 Section 5, Refactor: placeholder steps, `ScreenshotComponent`s with `[Alt text: …]`, `WatchOutComponent`s with placeholder content
- [ ] 4.8 "After" example component: same buttons with `aria-label` and `ngbTooltip`
- [ ] 4.9 Section 6, Final implementation: `WorkingExampleComponent` with the "after" example and its source files as `files`
- [ ] 4.10 Section 7, Automated tests: real, passing specs for the "after" example, shown in `CodeViewerComponent`
- [ ] 4.11 Section 8, Manual testing (after): `ResultsTableComponent` with placeholder rows, `VideoComponent`
- [ ] 4.12 Tutorials 2 and 3: pages from `TutorialLayoutComponent`, placeholder sections, status badges

### Phase 5: Check and ship

- [ ] 5.1 Run the `a11y-review` skill across the whole site; fix findings
- [ ] 5.2 Manual keyboard pass at phone, tablet, and desktop widths
- [ ] 5.3 Compare each screen and the 1.14 demo route with the mockups; list differences for the owner
- [ ] 5.4 Production build and deploy setup (pending hosting decision); confirm the demo route is excluded
- [ ] 5.5 List every placeholder the owner needs to fill, by page

### Later

- [ ] Video-hosting/deploy target decisions and record videos 
- [ ] Dark mode palette, contrast-checked
- [ ] Header theme toggle with `aria-label` and `ngbTooltip`

## Mockup differences

Running list for 5.3 and a possible wireframe revision.

| Step | Mockup | Build | Status |
|------|--------|-------|--------|
| 1.1 | No status badge | `StatusBadgeComponent`: `.badge` with `bg-*-subtle`, `text-*-emphasis`, `border-*-subtle` (secondary for Coming soon, warning for Under construction), `.text-uppercase` | Added |
| 1.2 | Breadcrumb above the `<h1>` | Not in `TutorialLayoutComponent` | Not built; could come from the 2.1 nav data |
| 1.2 | Tag, time, and tested-versions row under the `<h1>` | Not in `TutorialLayoutComponent`; can be projected | Not built |
| 1.2 | No status badge beside the `<h1>` | `StatusBadgeComponent` beside the `<h1>`, outside it | Added |
| 1.2 | Pagination link: "Previous" / "Next" label above title | Same, plus a visually hidden ": " between label and title | Matches visually |
| 1.2 | "On this page" column | Content column `col-xl-9`, `OnThisPageComponent` in `col-xl-3` (1.4) | Built in 1.4 |
| 1.3 | Step number before the `<h2>`; phone mockup puts it inside the `<h2>` | Optional `number` input, outside the `<h2>` at every width | Matches desktop mockup; mockups disagree |
| 1.3 | Headings 44 / 30 / 21px, bold | `$h1-font-size` 2.75rem, `$h2-font-size` 1.875rem, `$h3-font-size` 1.3125rem, `$headings-font-weight` 700; Bootstrap scales them down below 1200px | Matches at 1200px and up |
| 1.4 | "On this page" column starts level with the `<h1>` | Starts level with the first section, below the `<h1>` row | Differs |
| 1.4 | List links about 33px tall (6px 10px padding, 14px text) | 44px tall (`.small .lh-lg .py-2`), per DESIGN.md touch targets | Differs |
| 1.4 | Active section highlighted, `aria-current="location"` | No active state yet | Pending 2.8 |
| 1.4 | `.sticky-top` | `.sticky-xl-top`, top offset 0 | Offset pending 2.3 header |
| 1.4 | Phone: full-width bordered "On this page" button with down chevron | Same; chevron points up when open; list closes after a link is chosen | Matches, plus behavior |
| 1.5 | Header: type icon, type, id, status | `.card-header .bg-body-tertiary`; icon on `.bg-info`, id in `<code>`, status `.badge .bg-secondary-subtle .text-uppercase` | Matches |
| 1.5 | Summary, Description, Acceptance criteria; side column with Component, Labels, Links | Same fields, as `<dl>` groups; empty optional fields are omitted | Matches |
| 1.5 | Acceptance criteria with empty checkbox squares | `.list-group`; square is a decorative SVG | Matches |
| 1.5 | Side column with a left border; phone mockup stacks it under the main fields | `.vr` from `md` up, `<hr>` below `md`; stacks below `md` | Matches |
| 1.5 | Links about 21px tall | 44px tall (`.lh-lg .py-2`), per DESIGN.md touch targets | Differs |
| 1.5 | Plan: projected slots for criteria and links | Criteria and links are inputs, so markup stays consistent; criteria text can't hold inline markup such as `<code>` | Differs from plan |
| 1.6 | Shown expanded ("Hide code") | Starts collapsed ("View code"); `.btn-primary .btn-sm` with code icon, 46px tall | Matches when expanded |
| 1.6 | Tab strip and code on `#1F1A2E` | Tab strip on Bootstrap's dark surface (`data-bs-theme="dark"`, `#212529`); code on highlight.js `a11y-dark` (`#2b2b2b`), every token 7:1 or higher | Differs |
| 1.6 | Custom tabs: active tab `#2C2540` with a lavender underline | Bootstrap `.nav-tabs` in dark mode, file names in `.font-monospace .small` | Differs |
| 1.6 | 40px icon-only "Copy code" button | `.btn-outline-secondary` icon button, 46 × 50px, `aria-label` plus `ngbTooltip`; check icon and visually hidden "Copied" / "Copy failed" status after copying | Differs, plus behavior |
| 1.6 | Line numbers | None | Not built |
| 1.6 | Style guide: added lines marked with "+" and a tint | None | Not built |
| 1.6 | Frame around the viewer | No frame; `WorkingExampleComponent` frames it (1.7) | Built in 1.7 |
| 1.7 | Bordered frame, uppercase label in a header row, demo stage on `#F7F5FC` (40px × 24px padding), code toggle below a top border | `.card`; `.card-header .bg-body` with `.small .fw-bold .text-uppercase .text-body-secondary` label; `.card-body .bg-body-tertiary .px-4 .py-5`; code viewer with `.border-top` | Matches |
| 1.7 | No grouping semantics | Frame is `role="group"` named by its label | Added, not visible |
| 1.7 | Frame clips its content (`overflow: hidden`) | Only the code viewer is clipped (`.rounded-bottom .overflow-hidden`), so demo tooltips aren't cut off | Differs, not visible |

## Open questions

