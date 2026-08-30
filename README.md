# Demo Marketing Website

A content-driven marketing site built with Astro. Pages are composed from reusable blocks of atoms and authored as JSON, so adding a page needs no
code changes.

## General Details

- **Project**: Demo Marketing Website
- **Date**: 30/08/2026
- **Author**: Hari Sridharan

## Stack

- **Frameworks & Libraries**: Astro, TypeScript, Node 22
- **Architecture**: Atomic-first composition
- **Data Layer**: Local JSON, validated with Zod via Astro content collections
- **Styling**: Tailwind 4 with design tokens, Inter and Sora self-hosted
- **Tooling**: ESLint, Prettier, husky + lint-staged running on commit

## Getting started

Requires Node 22

```bash
npm install
npm run dev
```

## Project structure

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

## Adding a page

Create a JSON file in `src/data/`. The filename becomes the route, so `about.json` renders at `/about`.

```json
{
    "title": "About",
    "description": "Meta description for search results.",
    "blocks": [
        {
            "type": "hero",
            "layout": "centered",
            "heading": "About us",
            "description": "Supporting copy."
        }
    ]
}
```

No code changes needed. Content is validated at build against the schema in `src/content/schema.ts`, so a missing or malformed field fails the build
with the file and field named.

## Adding a block

```bash
npm run new:block <name>
```

This generates the component and prints the two lines to add to `registry.ts` and `schema.ts`.

## Conventions

- Blocks compose from atoms. No raw `h1`, `p`, `a` or `img` in a block.
- Visual values come from tokens in `global.css`. No hardcoded colours or sizes.
- Props for system decisions (`variant`, `tone`), `class` for layout one-offs.
- Shared classes go in `global.css`. Styles used by one component go in a scoped `<style>` block in that component.
- Images live in `src/assets/` and are imported so Astro can optimise them. `public/` is only for files needing a stable URL.

## Scripts

| Command                    | Does                              |
| -------------------------- | --------------------------------- |
| `npm run dev`              | Start the dev server              |
| `npm run build`            | Type-check, then build to `dist/` |
| `npm run preview`          | Serve the built output            |
| `npm run check`            | Type-check only                   |
| `npm run lint`             | Lint                              |
| `npm run format`           | Prettier Code Format              |
| `npm run new:block <name>` | Scaffold a new block              |

Lint and format also run automatically on commit.
