import { createFileRoute } from '@tanstack/react-router'
import { Bell, Palette, Shield, User } from 'lucide-react'
import { useState, type ElementType } from 'react'
import { AppearanceSettings } from '@/components/settings/appearance-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { SecuritySettings } from '@/components/settings/security-settings'
import { cn } from '@/lib/utils'

// TanStack's file-router plugin requires this registration export and owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
})

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance'

const tabs: { id: SettingsTab; label: string; icon: ElementType; component: ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User, component: ProfileSettings },
  { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationSettings },
  { id: 'security', label: 'Security', icon: Shield, component: SecuritySettings },
  { id: 'appearance', label: 'Appearance', icon: Palette, component: AppearanceSettings },
]

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage demo account settings and device preferences.
        </p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <nav aria-label="Settings sections" className="shrink-0 lg:w-64">
          <div className="space-y-1 lg:sticky lg:top-24">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                id={`settings-${tab.id}-button`}
                aria-controls={`settings-${tab.id}`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <tab.icon className="size-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
        <div className="max-w-2xl flex-1">
          {tabs.map((tab) => (
            <section
              key={tab.id}
              id={`settings-${tab.id}`}
              aria-labelledby={`settings-${tab.id}-button`}
              hidden={activeTab !== tab.id}
            >
              <tab.component />
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
