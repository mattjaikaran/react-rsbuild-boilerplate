import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Bug, Lightbulb, MessageSquare, Star } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const feedbackSchema = z.object({
  name: z.string(),
  email: z.union([z.string().email('Enter a valid email address'), z.literal('')]),
  type: z.enum(['bug', 'feature', 'improvement', 'general']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
})

type FeedbackValues = z.infer<typeof feedbackSchema>

// TanStack's file-router plugin requires this registration export and owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/feedback')({
  component: FeedbackPage,
})

export function FeedbackPage() {
  const submission = useRef<FeedbackValues | null>(null)
  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { name: '', email: '', title: '', description: '' },
  })
  const handleSubmit = (values: FeedbackValues) => {
    submission.current = values
  }

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
    {
      value: 'feature',
      label: 'Feature Request',
      icon: Lightbulb,
      color: 'text-yellow-500',
    },
    {
      value: 'improvement',
      label: 'Improvement',
      icon: Star,
      color: 'text-blue-500',
    },
    {
      value: 'general',
      label: 'General Feedback',
      icon: MessageSquare,
      color: 'text-green-500',
    },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Feedback</h1>
        <p className="text-xl text-muted-foreground">
          Help us improve by sharing your thoughts and suggestions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {feedbackTypes.map((type) => (
          <Card key={type.value} className="text-center">
            <CardContent className="pt-6">
              <type.icon className={`mx-auto mb-3 size-8 ${type.color}`} />
              <h3 className="font-semibold">{type.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {type.value === 'bug' && "Report issues or bugs you've encountered"}
                {type.value === 'feature' && 'Suggest new features or functionality'}
                {type.value === 'improvement' && 'Ideas to make existing features better'}
                {type.value === 'general' && 'Share your overall experience and thoughts'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Share Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {feedbackTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief summary of your feedback" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed feedback, steps to reproduce (for bugs), or specific suggestions..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Nice to have</SelectItem>
                        <SelectItem value="medium">Medium - Would be helpful</SelectItem>
                        <SelectItem value="high">High - Important issue</SelectItem>
                        <SelectItem value="critical">Critical - Blocking issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Submit Feedback
                </Button>
              </div>
              {form.formState.isSubmitSuccessful && (
                <output className="block text-sm text-muted-foreground">
                  Feedback captured for this session. This demo does not send feedback.
                </output>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-x-3 rounded-lg bg-muted/50 p-4">
              <Lightbulb className="mt-0.5 size-5 text-yellow-500" />
              <div className="flex-1">
                <p className="font-medium">Add dark mode toggle to navbar</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  It would be great to have a quick way to switch between light and dark modes.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Feature Request - 2 days ago - Implemented
                </p>
              </div>
            </div>

            <div className="flex items-start gap-x-3 rounded-lg bg-muted/50 p-4">
              <Bug className="mt-0.5 size-5 text-red-500" />
              <div className="flex-1">
                <p className="font-medium">Form validation not working on mobile</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The form validation messages don&apos;t appear properly on mobile devices.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Bug Report - 1 week ago - In Progress
                </p>
              </div>
            </div>

            <div className="flex items-start gap-x-3 rounded-lg bg-muted/50 p-4">
              <Star className="mt-0.5 size-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium">Improve loading states</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add skeleton loaders and better loading indicators throughout the app.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Improvement - 1 week ago - Planned
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
