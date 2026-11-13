# AGENTS.md

Single source of agent instructions for this repository. Codex, opencode, Cursor, and Claude Code (through the `CLAUDE.md` import) read this file; the nearest `AGENTS.md` wins in nested directories. Keep durable facts here or in `docs/`, and procedures in `.claude/skills/`.

## Project overview

React 19 single-page app built with Rsbuild (Rspack/SWC), TypeScript, and Tailwind CSS v4. TanStack Router owns file-based routes, TanStack Query owns server state, Zustand owns client state, shadcn/ui primitives sit beside semantic Tailwind tokens, and react-hook-form + Zod own forms. The frontend consumes a vendored OpenAPI contract at `backend/docs/openapi/openapi.json` and commits the generated SDK.

- [README.md](README.md) — stack, setup, scripts, Docker.
- [DESIGN.md](DESIGN.md) — authoritative visual guide and design workflow.
- [DEPENDENCIES.md](DEPENDENCIES.md) — every dependency with its pinned version.
- [docs/architecture.md](docs/architecture.md) — directory map, module ownership, code standards, and patterns.

## Commands

Run from the repository root with Bun 1.3+ and Node `^20.19.0 || >=22.13.0` (see `package.json`).

| Task                     | Command                      |
| ------------------------ | ---------------------------- |
| Install                  | `bun install`                |
| Dev server (port 3000)   | `bun run dev`                |
| Production build         | `bun run build`              |
| Preview the build        | `bun run preview`            |
| Unit and component tests | `bun run test`               |
| Typecheck                | `bun run typecheck`          |
| Lint                     | `bun run lint`               |
| Lint, warnings fail      | `bun run lint:strict`        |
| Lint and auto-fix        | `bun run lint:fix`           |
| Format                   | `bun run format`             |
| Format check             | `bun run format:check`       |
| Convention checks        | `bun run check-conventions`  |
| Dependency documentation | `bun run check-dependencies` |
| Agent docs and links     | `bun run check:agents`       |
| Regenerate the SDK       | `bun run api:generate`       |
| SDK drift check          | `bun run api:check`          |
| React Doctor             | `bun run doctor`             |
| Static gate              | `bun run check`              |
| Full gate                | `bun run gauntlet`           |

`bun run check` runs typecheck, lint, tests, convention checks, and dependency checks. `bun run gauntlet` adds the API drift and formatting checks. `make help` lists Makefile wrappers for the same tasks. `bun run dev` and `bun run preview` stay running until stopped; every other command exits non-zero on failure. CI runs Oxlint, the Oxfmt check, typecheck, unit tests, the build, and React Doctor on code changes, and always runs `check:agents` and `api:check`; docs-only pull requests skip the code jobs. Run the rest locally.

## Architecture and code standards

Read [docs/architecture.md](docs/architecture.md) before changing `src/`. It is the source of truth for build and runtime wiring, directory ownership, the route, API service, query hook, mutation, and store-slice patterns, generated-file boundaries, and code standards. [DESIGN.md](DESIGN.md) is authoritative for anything visual.

## Testing policy

Vitest and Testing Library run in jsdom with co-located `src/**/*.{test,spec}.{ts,tsx}` files and helpers in `src/test/`. `bun run test` runs the suite; `bun run check` and `bun run gauntlet` include it.

For agent-run tasks, do not add or change unit tests. When a change needs permanent coverage, add or extend a Playwright e2e test or a backend smoke test under `tests/smoke` in the repository's style, and run it alongside the static gates. This repository has no Playwright or smoke harness yet; add one with the change when the behavior needs it, and document its command here. Report exactly which checks ran.

## Git and commits

- Use Conventional Commits: `type(scope): Imperative summary`, subject at most 50 characters. Types in use: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `build`, `ci`.
- Wrap the body at 72 columns and explain what changed and why.
- Stage explicit paths, keep the worktree clean, and never commit build output or stale generated files.
- Do not push, force-push, or create, edit, or mark pull requests ready. agent-run pushes the branch and opens the pull request after its quality gate.

## Specs and agent-run

Agent-run tasks start from a spec in `tasks/specs/`. The format, the `Files owned` boundary, verification commands, and gate behavior are documented in [tasks/specs/README.md](tasks/specs/README.md).

## Security

- Client environment variables use the `PUBLIC_` prefix and are public. Keep secrets, tokens, and private endpoints out of `PUBLIC_*`, source, tests, and fixtures. `.env*` is gitignored; `.env.example` documents the required keys.
- Use exact dependency versions: no `^` or `~`. Add with `bun add pkg@x.y.z`, upgrade with `bun add pkg@latest`, and document every package in [DEPENDENCIES.md](DEPENDENCIES.md); `bun run check-dependencies` enforces it.
- Treat `src/api/generated/` as vendor code. Regenerate it with `bun run api:generate` after contract changes and prove freshness with `bun run api:check`.
- Access tokens persist in versioned localStorage keys by design. The tradeoff and its production path are documented in [DESIGN.md](DESIGN.md). Never suppress React Doctor findings globally; add only scoped entries to `doctor.config.json`.

## Skills and personal files

Skills live in `.claude/skills/<name>/SKILL.md` with `name` and `description` frontmatter so only metadata loads until the skill is used. Use skills for procedures and keep facts here or in `docs/`. The tracked `react-doctor` skill is symlinked from its pinned package.

Personal overrides (`*.local.*`, including `.claude/settings.local.json`) are gitignored. Commit `.mcp.json`, `.claude/settings.json`, or `.claude/agents/` only when the repository needs them.
