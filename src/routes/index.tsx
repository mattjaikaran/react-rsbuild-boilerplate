import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Check, Layers, Zap, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

// TanStack's file-router plugin requires this registration export and owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/')({ component: HomePage })

const foundations = [
  {
    number: '01',
    title: 'Build without the wait',
    detail:
      'Rsbuild and SWC keep the feedback loop short, with the same bundler in development and production.',
    icon: Zap,
  },
  {
    number: '02',
    title: 'A place for every concern',
    detail:
      'Typed routes, server-state caching, validated forms, and small reusable components are already connected.',
    icon: Layers,
  },
  {
    number: '03',
    title: 'Make it unmistakably yours',
    detail:
      'Semantic colors, local components, and a clear edit map. No hidden design system to work around.',
    icon: SlidersHorizontal,
  },
]
const milestones = [
  { title: 'Lay the groundwork', detail: 'Routes, tokens, and shared components', complete: true },
  {
    title: 'Shape the experience',
    detail: 'A focused workflow, built around people',
    complete: true,
  },
  { title: 'Ship something useful', detail: 'Your next chapter starts here', complete: false },
]

function HomePage() {
  return (
    <div className="space-y-16 py-6 md:space-y-24 md:py-12">
      <section
        className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]"
        aria-labelledby="home-heading"
      >
        <div className="space-y-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            A considered starting point / React + Rsbuild
          </p>
          <h1
            id="home-heading"
            className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Less setup.
            <br />
            More <span className="font-serif italic text-primary">possibility.</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Start with the pieces that matter. A fast, thoughtfully assembled workspace for turning
            your next idea into something people love to use.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/dashboard">
                Explore the workspace <ArrowRight aria-hidden="true" className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://rsbuild.rs" target="_blank" rel="noopener noreferrer">
                Read the Rsbuild docs<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            React 19 · TypeScript · TanStack · Your next idea
          </p>
        </div>
        <section
          className="relative rounded-2xl border bg-card p-5 shadow-[8px_8px_0_0_hsl(var(--secondary))] sm:p-7"
          aria-labelledby="preview-heading"
        >
          <div className="mb-8 flex items-center justify-between border-b pb-5">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Layers className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold">Your workspace</span>
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              Sample project
            </span>
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Project overview
          </p>
          <h2 id="preview-heading" className="mt-2 text-3xl font-semibold tracking-tight">
            From idea to everyday.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A little structure. Plenty of room to grow.
          </p>
          <div className="my-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-3xl font-semibold">
                02<span className="text-base text-muted-foreground"> / 03</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Milestones complete</p>
            </div>
            <div className="rounded-xl border p-4">
              <p className="font-serif text-3xl italic text-primary">Ready.</p>
              <p className="mt-1 text-xs text-muted-foreground">For your personal touch</p>
            </div>
          </div>
          <ol className="space-y-4">
            {milestones.map((milestone, index) => (
              <li key={milestone.title} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${milestone.complete ? 'bg-accent text-accent-foreground' : 'border text-muted-foreground'}`}
                >
                  {milestone.complete ? (
                    <Check className="size-3.5" aria-label="Complete" />
                  ) : (
                    index + 1
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium">{milestone.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{milestone.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            to="/todos"
            className="mt-7 flex items-center justify-between border-t pt-4 text-sm font-medium text-primary"
          >
            Try the task workflow <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </section>
      <section aria-labelledby="foundations-heading" className="border-t pt-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="foundations-heading" className="text-3xl font-semibold tracking-tight">
            Good foundations. Open possibilities.
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            The essentials are in place. Spend your energy on what makes your product different.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {foundations.map(({ number, title, detail, icon: Icon }) => (
            <article key={number} className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-mono text-xs text-muted-foreground">{number}</span>
                <Icon className="size-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className="flex flex-col justify-between gap-6 rounded-2xl bg-secondary p-7 sm:flex-row sm:items-center sm:p-10"
        aria-labelledby="next-heading"
      >
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Make your first move
          </p>
          <h2 id="next-heading" className="text-2xl font-semibold tracking-tight">
            A starter, not a straitjacket.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore the included features, then make space for your own.
          </p>
        </div>
        <Button asChild>
          <Link to="/about">
            Meet the stack <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
