# React Rsbuild Boilerplate

## Commands
```bash
bun run dev          # Dev server (port 3000)
bun run build        # Production build
bun run check        # Biome lint + format
bun run check:all    # typecheck + biome + test
bun run test         # Vitest
bun run lint:fix     # Biome lint auto-fix
bun run format       # Biome format
```

## Architecture
- **Rsbuild** (not Vite) — `rsbuild.config.ts`, `@rsbuild/plugin-react`
- **TanStack Router** — file-based routes in `src/routes/`, generates `routeTree.gen.ts`
- **TanStack Query** — server state in `src/main.tsx`
- **Zustand** — client state in `src/lib/store.ts`
- **shadcn/ui** — components in `src/components/ui/`
- **Path alias** — `@/` → `src/`
- **Env vars** — `PUBLIC_` prefix (not VITE_), via `src/config/env.ts`
- **API client** — `src/api/client.ts` (axios + JWT interceptors)
- **Tests** — co-located `*.test.tsx`, utils at `src/test/utils.tsx`

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

## New Store
```tsx
import { create } from 'zustand'
export const useMyStore = create<{ count: number }>()((set) => ({
  count: 0,
}))
```
