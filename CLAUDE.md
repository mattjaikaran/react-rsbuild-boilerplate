# React Rsbuild Boilerplate

## Commands
```bash
bun run dev          # Dev server (port 3000)
bun run build        # Production build
bun run check        # typecheck + lint + test
bun run test         # Vitest
bun run lint:fix     # ESLint auto-fix
bun run format       # Prettier
```

## Architecture
- **Rsbuild** (not Vite) — `rsbuild.config.ts`, `@rsbuild/plugin-react`
- **TanStack Router** — file-based routes in `src/routes/`, generates `routeTree.gen.ts`
- **TanStack Query** — server state via `src/hooks/queries/` and `src/hooks/mutations/`
- **Zustand** — client state in `src/lib/store/` with slices (auth, todo, ui, config)
- **shadcn/ui** — components in `src/components/ui/`
- **react-hook-form + zod** — forms in `src/forms/`
- **Path alias** — `@/` → `src/`
- **Env vars** — `PUBLIC_` prefix (not VITE_), via `src/config/env.ts`
- **API client** — `src/api/client.ts` (axios + JWT interceptors)
- **Mock API** — `src/mock-api/index.ts` for development
- **Tests** — co-located `*.test.tsx`, utils at `src/test/utils.tsx`

## Directory Structure
```
src/
├── api/              # API service functions (auth, todos)
├── components/
│   ├── layouts/      # MainLayout, AuthLayout, DashboardLayout
│   ├── nav/          # Navbar, Footer
│   ├── providers/    # QueryProvider, ThemeProvider wrappers
│   ├── shared/       # Hero, ThemeToggle
│   └── ui/           # shadcn primitives (button, card, form, etc.)
├── config/           # Environment config
├── forms/            # react-hook-form + zod forms (auth/, todos/)
├── hooks/
│   ├── api/          # Generic CRUD hooks, optimistic updates
│   ├── mutations/    # Auth + Todo mutation hooks
│   ├── queries/      # Auth + Todo query hooks
│   └── utils/        # useDebounce, useLocalStorage, useMediaQuery
├── lib/
│   ├── helpers/      # Utility modules (array, async, format, object, storage, validation)
│   ├── store/        # Zustand store with slices
│   └── utils.ts      # cn() utility
├── mock-api/         # Mock data and handlers for development
├── routes/           # TanStack Router file-based routes
├── test/             # Test setup and utilities
└── types/            # TypeScript types by domain
```

## New Route
```tsx
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/my-page')({ component: MyPage })
function MyPage() { return <div>My Page</div> }
```

## New API Service
```tsx
import { apiClient } from '@/api/client'
export async function getItems() {
  const { data } = await apiClient.get('/items')
  return data
}
```

## New Query Hook
```tsx
import { useQuery } from '@tanstack/react-query'
import { getItems } from '@/api/items'
export function useItems() {
  return useQuery({ queryKey: ['items'], queryFn: getItems })
}
```

## New Store Slice
```tsx
// src/lib/store/slices/mySlice.ts
import type { StateCreator } from 'zustand'
export interface MySlice { count: number; increment: () => void }
export const createMySlice: StateCreator<MySlice> = (set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
})
```
