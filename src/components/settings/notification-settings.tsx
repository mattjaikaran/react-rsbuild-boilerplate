import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  taskReminders: z.boolean(),
})

const preferences = [
  {
    name: 'emailNotifications',
    label: 'Email Notifications',
    description: 'Receive notifications via email',
  },
  {
    name: 'pushNotifications',
    label: 'Push Notifications',
    description: 'Receive push notifications in your browser',
  },
  {
    name: 'weeklyDigest',
    label: 'Weekly Digest',
    description: 'Receive a weekly summary of your activity',
  },
  {
    name: 'taskReminders',
    label: 'Task Reminders',
    description: 'Get reminded about upcoming due dates',
  },
] as const

export function NotificationSettings() {
  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      taskReminders: true,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Demo preferences only: notifications are not delivered, and changes last until this page
          reloads.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              form.reset(values)
            })}
            className="space-y-6"
          >
            {preferences.map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <FormLabel>{item.label}</FormLabel>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <FormControl>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={field.value}
                          aria-label={item.label}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          onClick={() => field.onChange(!field.value)}
                          className={cn(
                            'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            field.value ? 'bg-primary' : 'bg-muted',
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg transition-transform',
                              field.value ? 'translate-x-5' : 'translate-x-0',
                            )}
                          />
                        </button>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="gap-2">
              <Save className="size-4" />
              Save Demo Preferences
            </Button>
            {form.formState.isSubmitSuccessful && !form.formState.isDirty && (
              <output className="block text-sm text-muted-foreground">
                Demo preferences saved for this page session. No notification service was
                configured.
              </output>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
