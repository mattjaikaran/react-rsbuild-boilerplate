# React Rsbuild Boilerplate

A production-ready React starter powered by [Rsbuild](https://rsbuild.rs) — the Rust-based alternative to Vite with consistent dev/prod bundling via [Rspack](https://rspack.rs).

## Stack

- **React 19** — UI library
- **Rsbuild** — Rust-powered build tool (SWC compilation, fast refresh)
- **TypeScript** — Strict mode with path aliases (`@/`)
- **TanStack Router** — File-based, type-safe routing with auto code splitting
- **TanStack Query** — Server state management and caching
- **Zustand** — Client state management
- **shadcn/ui** — Radix + Tailwind component library
- **Tailwind CSS** — Utility-first styling with dark mode
- **React Hook Form + Zod** — Form handling and validation
- **Axios** — HTTP client with JWT interceptors
- **Vitest** — Unit and component testing
- **Sonner** — Toast notifications

## Quick Start

```bash
# install dependencies
bun install

# start dev server
bun run dev

# production build
bun run build

# preview production build
bun run preview
```

## Scripts

| Command                 | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| `bun run dev`           | Start dev server on port 3000                                                     |
| `bun run build`         | Production build                                                                  |
| `bun run preview`       | Preview production build                                                          |
| `bun run lint`          | Run Oxlint                                                                        |
| `bun run lint:strict`   | Run Oxlint and deny warnings                                                      |
| `bun run lint:fix`      | Run Oxlint with auto-fix                                                          |
| `bun run format`        | Format the repository with Oxfmt                                                  |
| `bun run format:check`  | Check repository formatting                                                       |
| `bun run doctor`        | Run pinned React Doctor; errors block, telemetry and supply-chain checks disabled |
| `bun run typecheck`     | TypeScript type checking                                                          |
| `bun run test`          | Run tests                                                                         |
| `bun run test:watch`    | Run tests in watch mode                                                           |
| `bun run test:ui`       | Vitest UI                                                                         |
| `bun run test:coverage` | Tests with coverage report                                                        |
| `bun run check`         | Run typecheck + lint + test                                                       |
| `bun run clean`         | Remove dist and node_modules                                                      |

## Makefile

```bash
make help          # show all commands
make dev           # start dev server
make check         # typecheck + lint + test
make docker-up     # build and run with Docker
make component name=MyComponent  # scaffold a component
make route name=dashboard        # scaffold a route
make hook name=use-example       # scaffold a hook
```

## Project Structure

```
src/
├── api/            # API client and service functions
├── components/
│   ├── layouts/    # Page layouts (MainLayout)
│   ├── shared/     # Shared components (ThemeToggle)
│   └── ui/         # shadcn/ui primitives (Button, Card, Input)
├── config/         # App configuration (env vars)
├── hooks/          # Custom React hooks
├── lib/            # Utilities (cn, store)
├── routes/         # TanStack Router file-based routes
├── test/           # Test setup and utilities
└── types/          # TypeScript type definitions
```

## Why Rsbuild over Vite?

- **Dev/prod parity** — Same Rspack bundler in dev and prod (Vite uses ESM in dev, Rollup in prod)
- **SWC everywhere** — Single compiler for JSX, TypeScript, and minification
- **Webpack compatibility** — Use existing webpack plugins and loaders
- **Module Federation** — First-class support for micro-frontends

## Docker

```bash
# Build and run
docker compose up -d

# Or manually
docker build -t react-rsbuild .
docker run -p 3000:80 react-rsbuild
```

## Adding shadcn/ui Components

This boilerplate includes Button, Card, and Input. To add more, copy from [shadcn/ui](https://ui.shadcn.com) into `src/components/ui/`.

## Environment Variables

Copy `.env.example` to `.env` and update values. Rsbuild uses `PUBLIC_` prefix for client-side env vars.

## Design and Quality Tooling

The landing page is a warm-paper, cobalt-accented starter with a sample workspace preview and working links to the included dashboard and task workflow. See [DESIGN.md](DESIGN.md) for the theme tokens, edit map, and accessibility conventions.

Oxlint uses its built-in TypeScript, React, and JSX accessibility plugins, including Rules of Hooks and exhaustive dependencies. Configuration lives in `.oxlintrc.json`; formatting lives in `.oxfmtrc.json`. Generated routes, build output, and coverage are excluded. React Doctor's intentional exceptions remain in `doctor.config.json`. Run `bun run doctor -- --json` for machine-readable diagnostics.

## License

MIT
