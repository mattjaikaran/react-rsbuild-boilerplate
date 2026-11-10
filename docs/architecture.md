# Architecture

Reference for the frontend architecture and code standards. [AGENTS.md](../AGENTS.md) is the agent entry point; [DESIGN.md](../DESIGN.md) owns visual decisions.

## Runtime wiring

- **Rsbuild**, not Vite. `rsbuild.config.ts` registers `@rsbuild/plugin-react`, the TanStack Router plugin, the port 3000 dev server, and the `@/` alias to `src/`.
- **TanStack Router** generates `src/routeTree.gen.ts` from the files in `src/routes/`. Adding or renaming a route file is enough; the plugin owns registration and HMR.
- **TanStack Query** owns server state through `src/hooks/queries/` and `src/hooks/mutations/`. The provider is mounted in `src/components/providers/`.
- **Zustand** owns client state in `src/lib/store/`, split into auth, todo, ui, and config slices. Startup restoration and persistence live in `src/lib/store/index.ts`.
- **shadcn/ui** primitives live in `src/components/ui/`; they read semantic tokens declared in `src/index.css`.
- **react-hook-form + zod** own forms in `src/forms/`, with resolvers from `@hookform/resolvers`.
- **API client**: `src/api/client.ts` creates the Axios instance, attaches the bearer token, handles 401 session expiry, and gives the generated SDK its base configuration.
- **OpenAPI**: `openapi-ts.config.ts` reads `backend/docs/openapi/openapi.json` (or `OPENAPI_SPEC_PATH`) and emits `src/api/generated/`, which is committed.
- **Mock API**: `src/mock-api/index.ts` provides development handlers.
- **Environment**: `src/config/env.ts` reads `PUBLIC_*` variables, so client code never touches `import.meta.env` directly.

## Directory structure

```
src/
├── api/              # Axios instance, generated SDK, domain service modules
├── components/
│   ├── layouts/      # MainLayout, AuthLayout, DashboardLayout
│   ├── nav/          # Navbar, Footer
│   ├── providers/    # QueryProvider and toast wrappers
│   ├── settings/     # Settings compositions
│   ├── shared/       # Hero, ThemeToggle
│   └── ui/           # shadcn primitives (button, card, form, etc.)
├── config/           # Environment config
├── forms/            # react-hook-form + zod forms (auth/, todos/)
├── hooks/
│   ├── api/          # Generic CRUD hooks and optimistic updates
│   ├── mutations/    # Auth and Todo mutation hooks
│   ├── queries/      # Auth and Todo query hooks
│   └── utils/        # Debounce, local storage, media query helpers
├── lib/
│   ├── helpers/      # Array, async, format, object, storage, validation
│   ├── store/        # Zustand store with slices
│   └── utils.ts      # cn() utility
├── mock-api/         # Mock data and handlers for development
├── routes/           # TanStack Router file-based routes
├── test/             # Test setup and utilities
└── types/            # TypeScript types by domain
```

## Code standards

- Keep one concern per module. Components render, hooks own data and effects, services own HTTP, helpers stay pure.
- Never call `fetch` or `axios` from a component. Server state flows through generated SDK service modules in `src/api/`, then query or mutation hooks.
- Use `useQuery` for reads and `useMutation` for writes. Invalidate or optimistically update the relevant query key in the mutation hook.
- Components use named exports. The convention gate rejects default component exports, `as any`, `@ts-ignore`, `console.log` in source, `window.location.href` navigation, `<Navigate>` in render, and component files over 300 lines.
- Forms use react-hook-form with a zod schema, not `useState` field state.
- Use semantic Tailwind tokens (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `text-primary`) rather than palette literals. Token values live in `:root` and `.dark` in `src/index.css`.
- `src/api/generated/` is hey-api output and `src/routeTree.gen.ts` is router output; both are produced by tooling.

## Patterns

### New route

```tsx
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/my-page')({ component: MyPage })
function MyPage() {
  return <div>My Page</div>
}
```

### New API service

```tsx
import { apiClient } from '@/api/client'
export async function getItems() {
  const { data } = await apiClient.get('/items')
  return data
}
```

### New query hook

```tsx
import { useQuery } from '@tanstack/react-query'
import { getItems } from '@/api/items'
export function useItems() {
  return useQuery({ queryKey: ['items'], queryFn: getItems })
}
```

### New store slice

```tsx
// src/lib/store/slices/mySlice.ts
import type { StateCreator } from 'zustand'
export interface MySlice {
  count: number
  increment: () => void
}
export const createMySlice: StateCreator<MySlice> = (set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
})
```
