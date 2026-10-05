import { zodResolver } from '@hookform/resolvers/zod'
import { Key, Shield } from 'lucide-react'
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

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain an uppercase letter, a lowercase letter, and a number',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const passwordFields = [
  { name: 'currentPassword', label: 'Current Password', autoComplete: 'current-password' },
  { name: 'newPassword', label: 'New Password', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'Confirm New Password', autoComplete: 'new-password' },
] as const

export function SecuritySettings() {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="size-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Try local password validation. This demo cannot verify your current password or change
            account credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(() => {
                for (const { name } of passwordFields) {
                  form.resetField(name)
                }
              })}
              className="space-y-4"
            >
              {passwordFields.map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete={item.autoComplete} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit" className="gap-2">
                <Key className="size-4" />
                Validate Demo Password
              </Button>
              {form.formState.isSubmitSuccessful && !form.formState.isDirty && (
                <output className="block text-sm text-muted-foreground">
                  Password validation succeeded locally. Fields were cleared; no password was
                  changed or sent to a server.
                </output>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Two-factor authentication requires a connected account service and is not available in
            this demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Status: Not configured</p>
        </CardContent>
      </Card>
    </div>
  )
}
