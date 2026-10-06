# Design Guide

This is the authoritative repository-local guide for visual changes. Update the brief here before changing implementation; README and CLAUDE defer to this guide.

## Design brief

Fill or revise these decisions for each new design before editing code:

- **Direction:** warm-paper editorial workspace, restrained monochrome actions, pure-black dark canvas, and neutral dark surfaces. Sample content is clearly labeled, never presented as live metrics or endorsements.
- **Colors:** record both themes' background, foreground, surface, action, focus, border, and status token pairs. Keep dark background `0 0% 0%`; primary actions and focus are monochrome. Light paper and mint accents remain intentional; coral denotes destructive actions.
- **Typography:** local Avenir Next/Avenir/Segoe UI sans stack; limited serif italic editorial accents. Specify heading scale, body measure, weight, and line height.
- **Layout:** responsive editorial hero and workspace preview; define page width, section spacing, card padding, and mobile stacking before modifying compositions.
- **Interactions:** solid primary for the next action, outline for supporting navigation; visible keyboard focus, reduced motion, and shared direct light/dark toggle. Specify hover, focus, disabled, validation, and empty states.

## Edit map

- `src/routes/index.tsx`: headline, calls to action, sample milestones, and foundation cards. The module-level arrays are the simplest place to change preview content.
- `src/index.css`: all semantic light/dark theme tokens, radii, global font stack, keyboard focus, and reduced-motion treatment.
- `src/components/layouts/main-layout.tsx`: shared navigation, page width, footer, and OS-change subscription while the preference is `system`.
- `src/components/shared/theme-toggle.tsx`: visible direct light/dark control used by header and settings.
- `src/components/layouts/dashboard-layout.tsx` and `src/components/nav/navbar.tsx`: additional shared navigation compositions that reuse the same theme control.
- `src/components/settings/appearance-settings.tsx`: appearance explanation and the shared control; `src/routes/settings/index.tsx` owns settings navigation and composition.
- `src/lib/store/slices/uiSlice.ts`: initial system preference, resolved two-way `toggleTheme`, and explicit theme application. `src/lib/store/index.ts` owns startup restoration and Zustand persistence.
- `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/components/ui/input.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/select.tsx`, and `src/components/ui/form.tsx`: shared local primitives and states; other primitives live beside them. Edit these directly instead of adding a second component system.
- `src/routes/dashboard/index.tsx`, `src/routes/todos/index.tsx`, `src/routes/todos/create.tsx`: working application examples linked from the landing. Keep these workflows connected when changing navigation.
- `src/routes/auth/`, `src/components/layouts/auth-layout.tsx`, and `src/forms/`: authentication layout and form compositions.

## Tokens and color

Use `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, and `text-primary` rather than hard-coded theme colors. Their HSL values live in `:root` and `.dark` in `src/index.css` and are exposed through Tailwind's `@theme`. Primary actions and focus rings are neutral ink in light mode and near-white in dark mode. Dark surfaces, borders, and muted text have zero saturation; the dark background is pure black. Light mode retains paper surfaces and mint accents; destructive status is coral. Pair surfaces with matching foreground tokens and adjust both themes deliberately. Root `color-scheme` follows the resolved light/dark class so native controls match an explicit choice.

## Typography and spacing

The sans-serif stack is local Avenir Next/Avenir/Segoe UI; no remote font request is needed. Serif italics are a small editorial accent, not body typography. The page uses one h1, descriptive h2 section headings, and h3 foundation titles. Headlines scale from 3rem on small screens to 4.5rem on large screens. Body copy stays comfortably narrow and uses relaxed line height. Keep small uppercase labels short and use tracking sparingly.

Use the existing 4px-based Tailwind spacing scale. Major sections have 64–96px separation; cards have 20–40px internal padding. The hero stacks on narrow screens and becomes two columns on large screens. Foundation cards stack until medium screens. Navigation wraps instead of hiding important links. Avoid fixed heights on text containers and check longer copy at mobile widths.

## Components and interactions

Use the shared Button variants: solid primary for the next useful action, outline for supporting navigation. Internal navigation uses TanStack `Link`; external documentation uses an anchor with safe new-tab attributes and an announcement. Preview milestones are static sample content, not controls or live progress. The dashboard and task links lead to the existing implemented workflows. Cards use restrained borders, rounded corners, and one offset surface shadow rather than gradients or decorative motion. Do not make an entire card clickable if it contains separate actions.

## Accessibility

Preserve semantic sections, named navigation, ordered milestones, and heading order. Decorative icons have `aria-hidden`; status icons have meaningful labels. Never convey destructive or completed status through color alone. Every interactive element must work from the keyboard and retain a visible focus ring. Keep text contrast readable in both themes, enlarge targets with padding, and maintain understandable link labels. The global `prefers-reduced-motion` rule disables prolonged animations and transitions; any new animation must respect it. No hover-only information or automatically moving preview content.

## Applying a new design

1. Update **Design brief** above with the intended direction, both-theme color pairs, typography, responsive layout, and interaction states. Keep this edit map accurate as ownership changes.
2. Change semantic tokens, font stack, radius, focus, and reduced-motion treatment in `src/index.css` first. Preserve the pure-black dark canvas, neutral dark surfaces, monochrome actions, and resolved native `color-scheme`.
3. Apply the brief to existing `src/components/ui/` primitives, including hover, focus, disabled, invalid, and destructive states. Reuse semantic classes rather than scattering palette literals.
4. Update shared layouts and controls, then route and form compositions in the edit map. Preserve implemented navigation and clearly labeled demo behavior.
5. Preserve the theme invariant: a fresh install follows OS appearance, including live OS changes; the only visible control directly switches light/dark. Both settings and header reuse `ThemeToggle` and `toggleTheme`. An explicit choice persists and overrides OS appearance; never expose a third System choice.
6. Run the repository's local gates, without treating code inspection as successful verification:

   ```bash
   bun run format:check
   bun run lint:strict
   bun run check
   bun run doctor
   bun run build
   ```

   `check` runs typecheck, lint, Vitest, convention checks, and dependency checks. `bun run gauntlet` is the existing combined formatting/lint/type/test/convention/dependency gate; it does not include Doctor or build. Preserve Oxlint/Oxfmt scripts, dependencies, editor settings, generated-file exclusions, and scoped Doctor exceptions.

7. Start the actual app with `bun run dev` (port 3000). Inspect `/`, `/settings` (Appearance), dashboard/task compositions, and auth forms at narrow and wide widths in both appearances. Check real computed body background, native controls, action contrast, focus, overflow, and reduced motion. Exercise the controls with keyboard and pointer; do not rely only on screenshots.
8. In a clean browser context, test both OS preferences and live OS changes before clicking. Then switch, reload, and change OS appearance again: the explicit choice must remain. Header and settings labels must agree; no System option should exist. Record checks actually performed and any failures.

Browser inspection needs no login for the public landing or settings page. Settings appearance is revealed with `#settings-appearance-button`; the shared button is named “Switch to dark mode” or “Switch to light mode” according to resolved appearance. The preference is stored in localStorage `theme` and persisted Zustand `app-store`; use a clean context or clear both for initial-default checks. Real authentication checks require a configured working backend and valid credentials, not invented tokens.

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
