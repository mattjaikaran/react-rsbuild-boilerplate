# 7 — Prepare for nested AGENTS.md and journey tests

## Problem

AGENTS.md carries repository-global rules (commits, secrets, branch and
agent-run policy, harness adapters) that belong to the root file of a mattstack
checkout, and it says nothing about the Playwright journey conventions the
backend JOURNEYS gate reads. `CLAUDE.md` is tracked as a harness adapter, so
AGENTS.md is not the only agent file. Without a Playwright config that writes a
JSON report, the gate cannot tell which journey step passed or failed.

## Files owned

- `AGENTS.md`
- `playwright.config.ts`
- `package.json`
- `bun.lock`
- `DEPENDENCIES.md`
- `.gitignore`
- `README.md` — scripts table rows for `test:e2e` and `check:agents`
- `CLAUDE.md` (delete)
- `tasks/specs/7-prepare-nested-agents-md-journey.md`

## Acceptance

- [ ] AGENTS.md keeps frontend facts only: package manager, dev/build/test
      commands, generated API client rules, Playwright conventions. Commit,
      secret, branch, and harness rules are gone.
- [ ] AGENTS.md documents the `@J-NNN` test tag and the
      `test.step('J-NNN-S<n>: ...')` step title convention.
- [ ] `playwright.config.ts` uses `testDir: 'e2e'` and a `list` + `json`
      reporter writing `test-results/journeys.json`.
- [ ] `bun run test:e2e` runs Playwright, and `@playwright/test` is pinned
      exactly and listed in DEPENDENCIES.md.
- [ ] No `CLAUDE.md` or tool-specific agent adapter is tracked.

## Verification

```bash
bun run lint
bun run typecheck
bun run build
bun run check:agents
bun run check-dependencies
```

## Notes

Decision: AGENTS.md stays at the repository root. This repository root is the
frontend package; there is no `frontend/` directory to move it into, and
`scripts/check_agent_docs.ts` resolves the root file and its links.

Decision: no e2e spec shipped. The issue asks for the config and convention;
browsers are not installed here, so `test:e2e` runs
`playwright test --pass-with-no-tests` and the suite is genuinely empty until
the first journey lands. Load errors still fail.

Decision: `.claude/skills/react-doctor/SKILL.md` stays. It is a pinned skill
symlink, not a harness instruction adapter; only `CLAUDE.md` was removed.
