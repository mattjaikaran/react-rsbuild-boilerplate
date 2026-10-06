import { Globe, Palette } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export function AppearanceSettings() {
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
        <div>
          <h3 className="text-base font-medium">Theme</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Your device appearance is used until you switch. Your choice applies immediately, is
            saved on this device, and overrides device appearance.
          </p>
          <ThemeToggle />
        </div>
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
