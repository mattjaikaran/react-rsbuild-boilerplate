import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, X } from 'lucide-react'
import { useId } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

type TodoFormValues = z.infer<typeof todoSchema>
const todoFieldsSchema = todoSchema.extend({ tagInput: z.string() })
type TodoFormFields = z.infer<typeof todoFieldsSchema>

interface TodoFormProps {
  defaultValues?: Partial<TodoFormValues & { id: string }>
  onSubmit?: (data: TodoFormValues) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function TodoForm({ defaultValues, onSubmit, onCancel, isLoading = false }: TodoFormProps) {
  const tagInputId = useId()

  const isEditing = !!defaultValues?.id

  const form = useForm<TodoFormFields>({
    resolver: zodResolver(todoFieldsSchema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      priority: defaultValues?.priority || 'medium',
      dueDate: defaultValues?.dueDate || '',
      tags: defaultValues?.tags || [],
      tagInput: '',
    },
  })
  const tags = useWatch({ control: form.control, name: 'tags' }) ?? []
  const tagInput = useWatch({ control: form.control, name: 'tagInput' })

  const handleSubmit = async (data: TodoFormFields) => {
    await onSubmit?.(todoSchema.parse(data))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      form.setValue('tags', [...tags, tagInput.trim()], { shouldDirty: true, shouldValidate: true })
      form.setValue('tagInput', '')
    }
  }

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      'tags',
      tags.filter((tag) => tag !== tagToRemove),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    )
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{isEditing ? 'Edit Todo' : 'Create New Todo'}</h2>
          <p className="text-sm text-muted-foreground">
            {isEditing
              ? 'Update your todo details below.'
              : 'Fill in the details to create a new todo.'}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter todo title" {...field} />
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
                    placeholder="Enter todo description (optional)"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={tagInputId}>Tags</Label>
            <div className="flex gap-2">
              <Input
                id={tagInputId}
                placeholder="Add a tag"
                {...form.register('tagInput')}
                onKeyDown={handleTagKeyDown}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTag}
                aria-label="Add tag"
                disabled={!tagInput.trim()}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isEditing ? 'Update Todo' : 'Create Todo'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </Form>
  )
}
