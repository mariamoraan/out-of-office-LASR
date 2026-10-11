---
name: spec-driven-workflow
description: >-
  Spec-driven development workflow for Out Of Office LASR: clarify with 0–5 sequential
  questions, propose a Markdown solution, then after agree create a plan with
  summary, Definition of Done, and short tasks executed one at a time after
  human approval. Use when the user asks to implement a feature, change product
  behavior, start a new phase, or says spec, SDD, plan, or "vamos a implementar".
---

# Spec-Driven Workflow

Required in this repo before implementing features or product changes.

## Step 1 — Questions (0 to 5)

- Ask **one question per message**. Wait for the answer before the next.
- Maximum 5. If 0 is enough, ask none.
- Prioritize ambiguities that change data model, flow UX, auth, or scope.
- Do not re-confirm decisions already closed in `AGENTS.md` or the active plan.

## Step 2 — Markdown solution

After clarifying, write an **MD spec** (in chat, or a `.md` file if the human asks) with:

- Context / goal
- Agreed decisions
- Default decisions (if any)
- Technical approach (key files/folders, domain, use-cases)
- Out of scope
- Brief risks or assumptions

**Stop.** Do not implement code until the human agrees the spec.

## Step 3 — Executable plan

When the human agrees the spec, create a plan with:

1. **Summary** (2–5 lines)
2. **Definition of Done**
3. **Task list** — short, self-contained, easy to review

Each task should be reviewable on its own (ideally a small, focused diff).

## Step 4 — Task-by-task execution

- Run **one task** after explicit approval ("ok", "next", "do task X").
- Exception: if the human approves a block ("phase 0", "do tasks 1–3"), run only that block and stop.
- When a task finishes: summarize what changed, which files were touched, and ask before the next task.
- Do not start the next task without OK.

## Anti-patterns

- Implementing while material questions are still open
- Skipping the MD spec
- Giant tasks ("build the whole survey")
- Mixing unrequested features (dashboard, auth, etc.) outside the plan

## Repo links

- Constitution: `.cursor/rules/constitution.mdc`
- Project map: `AGENTS.md`
