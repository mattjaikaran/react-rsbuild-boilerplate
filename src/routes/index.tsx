import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          React + Rsbuild Boilerplate
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          A modern React starter with Rsbuild, TanStack Router, TanStack Query,
          Zustand, shadcn/ui, and Tailwind CSS.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Rsbuild</CardTitle>
            <CardDescription>
              Rust-powered build tool with dev/prod parity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              SWC compilation, fast refresh, webpack plugin compatibility.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>TanStack Router</CardTitle>
            <CardDescription>
              Type-safe file-based routing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automatic code splitting, search params validation, preloading.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>shadcn/ui</CardTitle>
            <CardDescription>
              Beautiful, accessible components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Radix primitives styled with Tailwind. Copy-paste, fully
              customizable.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button asChild>
          <a
            href="https://rsbuild.rs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rsbuild Docs
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/mattjaikaran/react-rsbuild-boilerplate"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </Button>
      </div>
    </div>
  )
}
