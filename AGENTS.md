<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Out Of Office · LASR — Agent Guide

App to collect applications from people in Los Angeles de San Rafael who want to join a digital-product remote-workers group (**Out Of Office · LASR**). Includes a public multi-step survey and a private admin dashboard.

## Stack

- Next.js (App Router) + TypeScript
- SCSS + BEM (styles colocated with each component)
- Motion (animations / micro-interactions)
- Lucide (icons only via the `core/icons` barrel)
- Prisma + Neon (PostgreSQL)
- i18n under `core/i18n` (UI copy in Spanish)

## Folder architecture

```text
src/
  app/                    # Thin Next.js routes (composition, no domain logic)
  core/
    constants/            # App constants
    routes/               # Centralized paths
    icons/                # Lucide icon barrel
    i18n/                 # Copy and i18n helpers
  design-system/          # Reusable components (c-button, c-input, ...)
  features/
    <feature>/
      domain/             # Entities, value objects, rules
      use-cases/
        commands/         # Writes (CQRS)
        queries/          # Reads (CQRS)
      infrastructure/     # Prisma, mappers, adapters
      ui/                 # Feature screens and components
```

## Conventions

- Project Markdown (AGENTS, rules, skills, specs, plans) is written in **English**. UI copy stays Spanish via i18n.
- Files and folders use **kebab-case**.
- Each `.tsx` component lives in its own folder with a colocated `.scss` (BEM).
- BEM block prefixes: `c-*` (design system), `f-*` (feature UI) when useful.
- **Do not** import icons from `lucide-react` outside `src/core/icons`. Re-export every icon from the barrel.
- Features follow **DDD + CQRS**: UI → use-cases → domain/infrastructure. `app/` and route handlers contain no business logic.
- Design system: only truly reusable pieces (button, input, chip, progress, step shell, etc.).

## Product (survey)

Agreed fields:

| Field | Notes |
| --- | --- |
| Full name | Required |
| Age group | Optional; `18-25` / `26-39` / `40-54` / `55+` |
| Contact | Optional; email and/or WhatsApp. Privacy consent required only if a contact method is provided |
| Social profiles | Optional (LinkedIn, Instagram, X) |
| Work area | Optional; multi-select + Other (text) |
| Leisure | Optional; multi-select chips + Other (text) |
| Gender | Optional; `mujer` / `hombre` / `no_binario` / `prefiero_no_decirlo` |
| Meetup dates | Required; multi-select: Wed 14 19:00, Mon 19 19:00, Wed 21 19:00 |

Autosave: anonymous session cookie; persist on option select; text fields debounced (~400ms).

## Admin / dashboard

- Private route `/dashboard` (not linked from the survey).
- Auth: `ADMIN_USERNAME` + `ADMIN_PASSWORD` in env + signed session cookie.
- Only the admin can list/view responses. (Dashboard implementation is a separate feature.)

## Working method (Spec-Driven)

Follow the repo skill: `.cursor/skills/spec-driven-workflow/SKILL.md`.

Summary:

1. Up to 5 conversational questions (one at a time).
2. Markdown solution proposal.
3. After agree: plan with summary, Definition of Done, and short tasks.
4. Execute **one task at a time** after explicit human approval.

## Constitution

Hard rules always on: `.cursor/rules/constitution.mdc`.
