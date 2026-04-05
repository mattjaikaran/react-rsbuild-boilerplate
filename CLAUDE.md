# React Rsbuild Boilerplate

## Build & Dev
- `bun run dev` — start dev server (port 3000)
- `bun run build` — production build
- `bun run preview` — preview prod build
- `bun run check` — typecheck + lint + test (run before committing)

## Test
- `bun run test` — run all tests (vitest)
- `bun run test:watch` — watch mode
- `bun run test:coverage` — with coverage
- Test utils at `src/test/utils.tsx` — exports `render` with providers pre-wrapped
- Tests co-located: `component.test.tsx` next to `component.tsx`

## Lint & Format
- `bun run lint` / `bun run lint:fix` — ESLint
- `bun run format` — Prettier
- `bun run typecheck` — tsc --noEmit

## Architecture
- **Rsbuild** (not Vite) — config in `rsbuild.config.ts`, uses `@rsbuild/plugin-react`
- **TanStack Router** — file-based routes in `src/routes/`, auto-generates `routeTree.gen.ts`
- **TanStack Query** — server state, configured in `src/main.tsx`
- **Zustand** — client state in `src/lib/store.ts`
- **Path alias** — `@/` maps to `src/`
- **Env vars** — use `PUBLIC_` prefix (not VITE_), accessed via `src/config/env.ts`

## Conventions
- shadcn/ui components in `src/components/ui/` — copy from shadcn docs
- Layouts in `src/components/layouts/`
- Shared components in `src/components/shared/`
- API client in `src/api/client.ts` — axios with JWT interceptors
- Types in `src/types/`
- Custom hooks in `src/hooks/`

## Adding a New Route
Create `src/routes/my-page.tsx`:
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/my-page')({
  component: MyPage,
})

function MyPage() {
  return <div>My Page</div>
}
```
The route is auto-registered via TanStack Router plugin.

## Adding a New API Service
```tsx
import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types'

export async function getTodos(): Promise<ApiResponse<Todo[]>> {
  const { data } = await apiClient.get('/todos')
  return data
}
```

## Adding a Zustand Slice
Add to `src/lib/store.ts` or create a new store file:
```tsx
import { create } from 'zustand'

interface TodoState {
  todos: Todo[]
  addTodo: (todo: Todo) => void
}

export const useTodoStore = create<TodoState>()((set) => ({
  todos: [],
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
}))
```

## Docker
- `docker compose up -d` — build and run on port 3000
- Uses multi-stage build: bun install → rsbuild build → nginx serve
