import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RegisterForm } from '@/forms/auth/register-form'
import { useRegister } from '@/hooks/mutations/use-auth-mutations'

// TanStack's file-router plugin requires this registration export and owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1" />
          <CardContent>
            <RegisterForm
              isLoading={register.isPending}
              onSubmit={async (data) => {
                try {
                  await register.mutateAsync(data)
                } catch {
                  // The mutation error is rendered below; stay on the form to retry.
                  return
                }
                await navigate({ to: '/dashboard' })
              }}
              onSwitchToLogin={() => {
                navigate({ to: '/auth/login' })
              }}
            />
            {register.error && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {register.error.message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
