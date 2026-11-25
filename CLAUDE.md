# CLAUDE.md

## Rule 1: Claude writes no written content

The project owner writes all documentation and tutorial content. Claude builds the pages: components, templates, styles, routing, tests, config, and tooling. The project exists to showcase the owner's technical writing, so any prose Claude writes defeats its purpose.

**Claude may write:**
- **Placeholders and outlines:** bracketed prompts that mark where the owner's writing goes, e.g. `[Intro: the problem in one sentence]`. A prompt describes what belongs there; it is never a draft of the text itself.
- **UI labels and accessible names:** button text, nav item names, form labels, `aria-label`s, tooltip text, document titles (e.g. "Copy code", "Open navigation").
- **Commit messages and pull request descriptions.**

**Claude must not write:**
- Documentation or tutorial content: intros, explanations, steps, notes, tips, Watch out dialog text, ticket text (summaries, user stories, acceptance criteria), captions.
- Prose in Markdown files (`README.md`, `DESIGN.md`, `docs/`). Factual tables (tokens, hex values, contrast ratios, class names) are fine; descriptions and explanations are not.
- Alt text and video transcripts. Use a placeholder such as `[Alt text: what to notice]`.
- Code comments. Leave code uncommented, or add a placeholder comment (`// [Comment: why this override exists]`) where an explanation belongs.
- Feedback on the owner's writing: no reviews, critiques, or suggestions about wording, clarity, tone, or structure, and no edits to the owner's text.

**When a task needs written content,** build the structure with placeholders and list in the reply which placeholders the owner needs to fill. Don't offer drafts, "suggested wording", or example sentences, even when asked to be helpful, unless the owner explicitly asks for one in that message.

**The `docs-review` skill** in this repo checks facts only: links and anchors, image paths, file and folder paths, token and class names, commands, and versions. It reports what it finds and doesn't edit the docs, not even to fix a fact.

## Project

- Angular 22, Bootstrap 5.3.8, ng-bootstrap 21. Styled with Bootstrap classes, utility classes wherever possible; themed through Sass variables in `src/styles.scss`.
- Design decisions and planned tutorials: `BUILD_PLAN.md`. Design reference: `DESIGN.md`. Mockups: https://claude.ai/artifact/YNo5DKTvmajhYrEStYKJgC
- Commands: `npm start`, `npm run build`, `npm test`.
