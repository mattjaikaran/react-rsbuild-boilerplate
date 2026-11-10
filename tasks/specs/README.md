# Agent-run specs

Agent-run executes one spec per task from this directory. Keep one Markdown file per task, named after the issue or task, and link the issue or pull request that supplies the requirement.

## Spec format

````markdown
# Imperative task title

## Problem

What is wrong or missing, and the evidence for it.

## Files owned

- `path/to/file` — why this file changes
- `path/to/other`

## Acceptance

- Observable outcome that proves the task is done.

## Verification

```bash
bun run lint
bun run typecheck
bun run build
```

## Notes

Decisions, host limits, or known gaps.
````

## Rules

- `Files owned` is the edit boundary. Change only those paths; if another file must change, update the spec and explain why in the pull request body.
- Acceptance is behavior, not a list of edits. Include the command, route, or state that demonstrates it.
- List the exact verification commands. The gate runs the repository's static checks, backend smoke tests, and the Playwright e2e tests that cover the changed files before it pushes.
- No human is available during a run. Decide, record the decision under Notes and in the pull request body, and continue.
- Specs contain no secrets, credentials, or copied production data.
