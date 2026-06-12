@AGENTS.md

# Coffee Since 1999

A cafe marketing website showcasing the brand, menu, story, and location.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict, no `any`)
- **Styling**: Tailwind CSS v4 (utility-first, no separate config file — theme in `globals.css`)
- **React**: v19
- **Path alias**: `@/*` → `src/*`

## Project Structure

```
src/
  app/              # Next.js App Router pages and layouts
  components/
    ui/             # Primitive/reusable elements (Button, Card, Badge…)
    sections/       # Page sections (Hero, Menu, About, Footer…)
  content/          # Typed data and copy (menu, hours, location, social)
  lib/              # Utilities — cn() lives here
  types/            # Shared TypeScript interfaces
public/
  images/           # Photo and graphic assets
```

## Design

Warm, craft-coffee aesthetic. Evoke a neighborhood cafe with history and character.

Color tokens defined as CSS variables in `src/app/globals.css`:
- `--color-espresso` — deep brown for text and anchors
- `--color-cream` — off-white background
- `--color-caramel` — warm amber accent
- `--color-bark` — medium brown for borders and muted elements

Use `cn()` from `@/lib/utils` for all conditional className logic.

## SEO

- Page-level metadata via Next.js `generateMetadata` export
- OpenGraph and Twitter card tags on every page
- `src/app/sitemap.ts` for XML sitemap
- `src/app/robots.ts` for robots.txt

## Content

All copy and structured data lives in `src/content/cafe.ts` as typed TypeScript exports. No CMS. Update that file when content changes — no hardcoded strings in components.

## Dev Conventions

- Components: named exports, PascalCase files
- No default exports except page/layout files (Next.js requirement)
- Tailwind v4: use `@theme inline` in globals.css for custom tokens; no `tailwind.config.ts`
- `clsx` + `tailwind-merge` via `cn()` for class merging
