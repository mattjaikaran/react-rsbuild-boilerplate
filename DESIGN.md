# Design Guide

## Direction

Warm paper, ink typography, and vivid cobalt make this starter feel like a working notebook rather than a generic marketing template. Mint marks positive progress; coral is reserved for destructive actions. The landing composition pairs an editorial introduction with a clearly labeled sample workspace. It demonstrates a product workflow without claiming live metrics or inventing customer endorsements.

## Edit map

- `src/routes/index.tsx`: headline, calls to action, sample milestones, and foundation cards. The module-level arrays are the simplest place to change preview content.
- `src/index.css`: all semantic light/dark theme tokens, radii, global font stack, keyboard focus, and reduced-motion treatment.
- `src/components/layouts/main-layout.tsx`: shared navigation, page width, and footer.
- `src/components/shared/theme-toggle.tsx`: existing light/dark control.
- `src/components/ui/`: local Radix-based primitives. Edit these directly rather than wrapping a second component system around them.
- `src/routes/dashboard/` and `src/routes/todos/`: working application examples linked from the landing. Keep these features connected when changing navigation.

## Tokens and color

Use `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, and `text-primary` rather than hard-coded colors. Their HSL values live in `:root` and `.dark` in `src/index.css` and are exposed through Tailwind's `@theme`. `primary` is cobalt in light mode and a lighter blue in dark mode. `secondary` is a quiet surface, `accent` is mint, and `destructive` is coral. Pair surfaces with their matching foreground tokens. Adjust both themes together; do not invert every surface mechanically. Ring color follows the primary action color.

## Typography and spacing

The sans-serif stack is local Avenir Next/Avenir/Segoe UI; no remote font request is needed. Serif italics are a small editorial accent, not body typography. The page uses one h1, descriptive h2 section headings, and h3 foundation titles. Headlines scale from 3rem on small screens to 4.5rem on large screens. Body copy stays comfortably narrow and uses relaxed line height. Keep small uppercase labels short and use tracking sparingly.

Use the existing 4px-based Tailwind spacing scale. Major sections have 64–96px separation; cards have 20–40px internal padding. The hero stacks on narrow screens and becomes two columns on large screens. Foundation cards stack until medium screens. Navigation wraps instead of hiding important links. Avoid fixed heights on text containers and check longer copy at mobile widths.

## Components and interactions

Use the shared Button variants: solid primary for the next useful action, outline for supporting navigation. Internal navigation uses TanStack `Link`; external documentation uses an anchor with safe new-tab attributes and an announcement. Preview milestones are static sample content, not controls or live progress. The dashboard and task links lead to the existing implemented workflows. Cards use restrained borders, rounded corners, and one offset surface shadow rather than gradients or decorative motion. Do not make an entire card clickable if it contains separate actions.

## Accessibility

Preserve semantic sections, named navigation, ordered milestones, and heading order. Decorative icons have `aria-hidden`; status icons have meaningful labels. Never convey destructive or completed status through color alone. Every interactive element must work from the keyboard and retain a visible focus ring. Keep text contrast readable in both themes, enlarge targets with padding, and maintain understandable link labels. The global `prefers-reduced-motion` rule disables prolonged animations and transitions; any new animation must respect it. No hover-only information or automatically moving preview content.

## Quality tools

React Compiler-specific `refs`, `purity`, `incompatible-library`, and `set-state-in-effect` checks are not enabled because this template does not use React Compiler. `unicorn/no-empty-file` is also outside the former lint contract. Hooks, unused variables, prefer-const, and accessibility diagnostics remain active.

`.oxlintrc.json` enables built-in React, TypeScript, and JSX accessibility checks plus Hooks rules. `.oxfmtrc.json` owns formatting. Both exclude generated routes and build artifacts. React Doctor is pinned and invoked through `bun run doctor`; the intentional scoped configuration in `doctor.config.json` is preserved. Use `bun run lint:strict`, `bun run format:check`, and `bun run doctor` when reviewing design edits alongside the existing type and test gates.

Use Node 20.19+ or 22.13+ (22 LTS recommended) and Bun 1.3+. The TypeScript library includes ES2023 because the existing array helpers use `toSorted`. Composite Zustand selectors use `useShallow` for stable snapshots; image source changes reset lifecycle state without render-time ref mutation.

## Demo forms and authentication

Settings tabs use React Hook Form and Zod. Profile, password, and notification submissions are explicitly local demonstrations, with visible status feedback rather than claims of server persistence. Appearance controls apply the shared theme immediately. Contact and feedback likewise confirm only local capture; they do not send messages.

The fresh-install theme is `system` and follows OS changes while the app is open. Header and appearance controls use the same Zustand preference, not competing theme providers. Explicit choices persist on this device and override the OS.

The task workspace is an in-memory demo: creation, editing, completion, and deletion share state across routes and reset on reload. Seeded examples are illustrative; no task data is sent to a server. Creation no longer discards the submitted form, and task controls operate on the same collection rather than a disconnected static list.

Authentication remains a browser JWT integration: the backend returns a user plus access/refresh tokens, and requests use the access token as a Bearer header. The existing versioned localStorage keys (`auth_token:v1`, `refresh_token:v1`, `user:v1`) preserve sessions across reloads. This means script execution on this origin can read credentials; the React Doctor web-storage warning is a genuine documented security tradeoff, not suppressed. A production HttpOnly cookie model requires a coordinated backend contract change, CSRF handling, and corresponding client migration.

Startup restores stored session state before rendering the router. API failures never hard-navigate the browser. An authenticated 401 clears credentials and marks the session expired; the shared router layout redirects to login. A failed refresh also clears credentials. Invalid login requests remain on the login page. Successful authentication stores the actual backend response, not synthetic tokens. Public sample pages remain available on a fresh start.

TanStack file routes must export `Route`; its Rsbuild plugin owns route registration and HMR. Each required registration has a narrowly adjacent React Doctor `only-export-components` exception, not a file-wide or tree-wide exclusion. Similar auth-card and legal-page JSX intentionally remains separately owned: shared presentation alone does not justify coupling their behavior or content to satisfy a duplication heuristic.
