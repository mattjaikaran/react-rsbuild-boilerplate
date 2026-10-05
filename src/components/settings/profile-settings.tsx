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
import { Input } from '@/components/ui/input'

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Please enter a valid email address'),
})

type ProfileValues = z.infer<typeof profileSchema>

export function ProfileSettings() {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: 'Demo', lastName: 'User', email: 'demo@example.com' },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Try editing this demo profile. Changes stay on this page until you reload; no account is
          updated.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit((values) => {
              form.reset(values)
            })}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  { name: 'firstName', label: 'First Name', autoComplete: 'given-name' },
                  { name: 'lastName', label: 'Last Name', autoComplete: 'family-name' },
                ] as const
              ).map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input autoComplete={item.autoComplete} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="gap-2">
              <Save className="size-4" />
              Save Demo Profile
            </Button>
            {form.formState.isSubmitSuccessful && !form.formState.isDirty && (
              <output className="block text-sm text-muted-foreground">
                Demo profile saved for this page session. No account data was sent to a server.
              </output>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
