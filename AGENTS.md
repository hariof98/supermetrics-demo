# AGENTS.md

Instructions for AI agents working in this repository.

## What this is

A static marketing site built with Astro. Pages are authored as JSON in `src/data/` and composed from reusable blocks. Blocks are built from atoms.
There is no server and no client-side JavaScript.

## Stack

- **Frameworks & Libraries**: Astro, TypeScript (strict), Node 22
- **Architecture**: Atomic-first composition
- **Data Layer**: Local JSON, validated with Zod via Astro content collections
- **Styling**: Tailwind 4 with design tokens, Inter and Sora self-hosted
- **Tooling**: ESLint, Prettier, husky + lint-staged running on commit

## Structure

```text
src/
├── assets/        Images, imported so Astro can optimise them
├── components/
│   ├── atoms/     Text, Button, Link, Image, Container
│   └── blocks/    Hero, Feature, Action, Testimonial + registry.ts
├── content/
│   └── schema.ts  Zod schemas for pages and blocks
├── data/          Page content as JSON, one file per page
├── layouts/       BaseLayout, Header, Footer
├── pages/
│   └── [...slug].astro   One route for every page
└── styles/
    └── global.css        Design tokens and shared classes
```

## How the pieces fit together

Content flows in one direction:

```text
src/data/*.json
    ↓  validated by
src/content/schema.ts
    ↓  loaded by
src/content.config.ts
    ↓  rendered by
src/pages/[...slug].astro
    ↓  looked up in
src/components/blocks/registry.ts
    ↓  composed from
src/components/atoms/
```

A page's `type` field selects a block from the registry. The block receives the validated data as props and renders it using atoms. Atoms read every
visual value from tokens in `global.css`.

## Adding a page

Add a JSON file to `src/data/`. The filename becomes the route, so `about.json` renders at `/about`. No code changes are needed.

## Adding a block

Run `npm run new:block <name>`. It generates the component and prints the two lines to add to `registry.ts` and `schema.ts`.

Do not create block files by hand.

Before adding a block, check whether an existing one covers the case with a new variant. A `hero` with a `layout` option is better than separate
`hero` and `heroCentered` blocks, because an editor picking from a list should not have to know that two entries are the same thing.

## Adding an atom

Atoms are presentation primitives.

Add one only when a block needs an element no existing atom provides. If an existing atom is close, extend it with a variant instead of creating a new
one. Five atoms with clear variants are easier to work in than twelve overlapping ones.

Structure: `src/components/atoms/<Name>/<Name>.astro`

An atom must:

- Declare `interface Props` with a named type for each constrained option
- Read every visual value from a token in `global.css`, never hardcoded
- Accept `class` for layout one-offs
- Expose style choices as named variants, not as individual style props
- Have no defaults for values whose absence should fail loudly

Shared classes for the atom go in `@layer components` in `global.css`. Only layout specific to that one atom goes in a scoped `<style>` block.

## Rules

**Composition.** Blocks compose from atoms. Never write raw `h1`, `p`, `a` or `img` in a block. If a block needs an element with no atom, add the
atom.

**Component API.** Props for system decisions (`variant`, `tone`). `class` for layout and one-offs. Never override with `class` a value the variant
already sets.

**Schema and component agreement.** A block's props must be derived from its schema, not written separately. Use `Extract<Block, { type: "<name>" }>`
so the two cannot drift.

Where a block wraps an atom, the schema field must match what the atom requires. If an atom requires `alt`, the schema field is not optional. If the
schema marks a field optional, the component must handle it being absent.

Two specific mismatches to avoid:

- Schema says optional, component treats it as always present. Renders empty or crashes on a page where an editor left the field blank.
- Schema says required, component gives it a default. The default never fires, so it is dead code that misleads the next reader.

**Styles.** Tokens go in `@theme` in `global.css`. Classes used by more than one component go in `@layer components` in the same file. Styles used by
a single component go in a scoped `<style>` block in that component.

**Typography.** Fluid via `clamp()`. Do not add responsive text utilities.

**Defaults.** A default is only appropriate when there is a sensible fallback. `alt` and image dimensions have no defaults, because a missing value
should fail rather than be silently filled.

**Semantics.** `<a>` navigates, `<button>` acts. A CTA that goes to another page is a link.

**Images.** Local images go in `src/assets/` and are imported. `public/` is only for files needing a stable URL, such as `favicon.ico`.

**Content.** All content comes from JSON validated by `schema.ts`. Never hardcode copy in a component.

**Git.** Do not run `git add`, `git commit`, `git push`, or any other git command that changes repository state. Leave all changes uncommitted for
review. Reporting what you changed is enough.

## Before you finish

Do not report work as complete until you have run through this.

### 1. Verify it builds and runs

```bash
npm run check     # types
npm run lint      # ESLint
npm run build     # type-check and build
npm run preview   # serve the built output
```

All four must pass. A build that succeeds but was never previewed is not verified.

### 2. Re-read your own output against the rules

Open every file you created or changed and check each one against the list below. Do this after the work is done, as a separate pass. Most mistakes in
this codebase come from writing correctly and then drifting during edits.

**Blocks** (`src/components/blocks/`)

- No raw `h1`, `p`, `a`, `img` anywhere in the template
- Every piece of content renders through an atom
- Props derived from the schema, not hand-written
- Registered in `registry.ts`
- Layout styles in a scoped `<style>` block, not `global.css`

**Atoms** (`src/components/atoms/`)

- No hardcoded colours, sizes, spacing or fonts
- Every visual value reads from a token in `global.css`
- Style choices exposed as variants, not as individual style props
- `alt` and image dimensions have no defaults

**Schema** (`src/content/schema.ts`)

- New block added to the `discriminatedUnion` array
- Required strings use `.min(1)`, not bare `z.string()`
- Fixed sets use `z.enum`, not `z.string()`
- Every field's optionality matches how the component uses it
- Atom-level requirements such as `alt` are not weakened by the block's schema

**Content** (`src/data/`)

- No copy hardcoded in any component
- Every field matches the schema

**Styles** (`src/styles/global.css`)

- Shared classes here, single-component styles scoped in the component
- No responsive text utilities; typography is fluid via `clamp()`

### 3. Prove content validation still works

Temporarily remove a required field from a JSON file in `src/data/` and run `npm run build`. It must fail with the file and field named. Restore the
field and rebuild.

If the build passes with a field missing, the schema is not enforcing what it should.

### 4. Fix and repeat

If step 2 or 3 surfaced anything, fix it and run the whole sequence again. Report what you found and what you changed, not just that the work is done.

## Checks

- `npm run check` — types
- `npm run lint` — ESLint
- `npm run format` — Prettier

Lint and format run automatically on commit.
