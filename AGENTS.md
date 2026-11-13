# AGENTS.md

Rules for this React frontend package only: package manager, commands, the
generated API client, and the Playwright journey tests. A nested `AGENTS.md`
wins over this one. This is the only agent instruction file; do not add a
`CLAUDE.md` or another harness adapter.

## Project overview

React 19 single-page app built with Rsbuild (Rspack/SWC), TypeScript, and Tailwind CSS v4. TanStack Router owns file-based routes, TanStack Query owns server state, Zustand owns client state, shadcn/ui primitives sit beside semantic Tailwind tokens, and react-hook-form + Zod own forms. The frontend consumes a vendored OpenAPI contract at `backend/docs/openapi/openapi.json` and commits the generated SDK.

- [README.md](README.md) — stack, setup, scripts, Docker.
- [DESIGN.md](DESIGN.md) — authoritative visual guide and design workflow.
- [DEPENDENCIES.md](DEPENDENCIES.md) — every dependency with its pinned version.
- [docs/architecture.md](docs/architecture.md) — directory map, module ownership, code standards, and patterns.

Package manager: **Bun** 1.3+ (`bun.lock`) on Node `^20.19.0 || >=22.13.0`. No npm or yarn commands in docs.

## Commands

Run from the repository root with Bun.

| Task                     | Command                      |
| ------------------------ | ---------------------------- |
| Install                  | `bun install`                |
| Dev server (port 3000)   | `bun run dev`                |
| Production build         | `bun run build`              |
| Preview the build        | `bun run preview`            |
| Unit and component tests | `bun run test`               |
| Journey e2e tests        | `bun run test:e2e`           |
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

## Generated API client

`src/api/generated/` is vendor code generated from `backend/docs/openapi/openapi.json` by `@hey-api/openapi-ts` ([openapi-ts.config.ts](openapi-ts.config.ts)). Never edit it by hand. Regenerate with `bun run api:generate` after a contract change and prove freshness with `bun run api:check`; both must pass before commit.

## Testing

Vitest and Testing Library run in jsdom with co-located `src/**/*.{test,spec}.{ts,tsx}` files and helpers in `src/test/`. `bun run test` runs the suite; `bun run check` and `bun run gauntlet` include it.

For agent-run tasks, do not add or change unit tests. When a change needs permanent coverage, add or extend a Playwright journey test in `e2e/` and run `bun run test:e2e`.

## Playwright journeys

Journey tests live in `e2e/` and follow one convention, so the backend JOURNEYS
gate can map step results:

- Write **one test per journey**, tagged `@J-NNN` with the Playwright `tag`
  option. Do not write one test per step.
- Wrap each journey step in `test.step('J-NNN-S<n>: ...')`; the step number must
  match the journey spec.
- [playwright.config.ts](playwright.config.ts) runs the `list` and `json`
  reporters, and the JSON report at `test-results/journeys.json` is what the
  gate reads. Keep the reporter block and that path.

```ts
test('visitor signs up and signs in', { tag: '@J-001' }, async ({ page }) => {
  await test.step('J-001-S1: create an account', async () => {
    /* ... */
  })
  await test.step('J-001-S2: sign in', async () => {
    /* ... */
  })
})
```

`bun run test:e2e` starts the dev server itself and passes when no journey tests
exist yet; add the first spec with the journey it verifies.

## Dependencies

Use exact versions: no `^` or `~`. Add with `bun add pkg@x.y.z`, upgrade with
`bun add pkg@latest`, and document every package in
[DEPENDENCIES.md](DEPENDENCIES.md); `bun run check-dependencies` enforces it.
Access tokens persist in versioned localStorage keys by design; the tradeoff and
its production path are documented in [DESIGN.md](DESIGN.md). Never suppress
React Doctor findings globally; add only scoped entries to `doctor.config.json`.
