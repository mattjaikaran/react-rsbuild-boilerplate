import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { useAuth, useSetTheme, useTheme } from '@/lib/store'
import { useEffect } from 'react'

export function MainLayout() {
  const { error, isAuthenticated } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const setTheme = useSetTheme()
  useEffect(() => {
    if (theme !== 'system') return
    const preference = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystem = () => setTheme('system')
    preference.addEventListener('change', followSystem)
    return () => preference.removeEventListener('change', followSystem)
  }, [theme, setTheme])

  useEffect(() => {
    if (
      !isAuthenticated &&
      error === 'Your session has expired. Please sign in again.' &&
      !pathname.startsWith('/auth/')
    ) {
      void navigate({ to: '/auth/login', replace: true })
    }
  }, [error, isAuthenticated, navigate, pathname])
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex min-h-16 flex-wrap items-center gap-3 py-3">
          <nav
            aria-label="Main navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium"
          >
            <Link to="/" className="font-bold">
              Rsbuild<span className="text-primary"> / </span>Starter
            </Link>
            <Link to="/" className="transition-colors hover:text-foreground/80">
              Home
            </Link>
            <Link to="/about" className="transition-colors hover:text-foreground/80">
              About
            </Link>
            <Link to="/dashboard" className="transition-colors hover:text-primary">
              Workspace
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-wrap justify-between gap-3 text-sm text-muted-foreground">
          <p>Thoughtfully assembled. Ready to make your own.</p>
          <p>React + Rsbuild / Built for possibility</p>
        </div>
      </footer>
    </div>
  )
}
