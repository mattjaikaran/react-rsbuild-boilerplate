import { Globe, Palette } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSetTheme, useTheme } from '@/lib/store'
import { cn } from '@/lib/utils'

const themes = ['light', 'dark', 'system'] as const

export function AppearanceSettings() {
  const theme = useTheme()
  const setTheme = useSetTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="size-5" />
          Appearance
        </CardTitle>
        <CardDescription>Customize how the app looks on your device.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <fieldset>
          <legend className="text-base font-medium">Theme</legend>
          <p className="mb-4 text-sm text-muted-foreground">
            Your color scheme applies immediately and is saved on this device.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((option) => (
              <button
                type="button"
                key={option}
                aria-pressed={theme === option}
                onClick={() => setTheme(option)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  theme === option ? 'border-primary' : 'border-border',
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    'h-20 w-full rounded-md',
                    option === 'light'
                      ? 'border bg-white'
                      : option === 'dark'
                        ? 'bg-zinc-900'
                        : 'bg-gradient-to-r from-white to-zinc-900',
                  )}
                />
                <span className="text-sm font-medium capitalize">{option}</span>
              </button>
            ))}
          </div>
          <output className="mt-3 block text-sm text-muted-foreground">
            Selected theme: {theme}
          </output>
        </fieldset>
        <div>
          <h3 className="flex items-center gap-2 text-base font-medium">
            <Globe className="size-4" />
            Language
          </h3>
          <p className="text-sm text-muted-foreground">
            English. Other languages are not available in this demo.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
