import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MagicLinkForm } from '@/forms/auth/magic-link-form'
import { useMagicLink } from '@/hooks/mutations/use-auth-mutations'

// TanStack's file-router plugin requires this registration export and owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/auth/magic-link')({
  component: MagicLinkPage,
})

export function MagicLinkPage() {
  const navigate = useNavigate()
  const magicLink = useMagicLink()

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1" />
          <CardContent>
            <MagicLinkForm
              isLoading={magicLink.isPending}
              onSubmit={async (data) => {
                try {
                  await magicLink.mutateAsync(data)
                } catch {
                  // The mutation error is rendered below; stay on the form to retry.
                  return
                }
              }}
              onSwitchToLogin={() => {
                navigate({ to: '/auth/login' })
              }}
            />
            {magicLink.error && (
              <p role="alert" className="mt-4 text-sm text-destructive">
                {magicLink.error.message}
              </p>
            )}
            {magicLink.isSuccess && (
              <output className="mt-4 block text-sm text-muted-foreground">
                {magicLink.data.message}
              </output>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
