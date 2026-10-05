import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TodoForm } from '@/forms/todos/todo-form'
import { useStore } from '@/lib/store'

// TanStack's file-router plugin requires this registration export and owns route HMR.
// react-doctor-disable-next-line react-doctor/only-export-components
export const Route = createFileRoute('/todos/create')({
  component: CreateTodoPage,
})

export function CreateTodoPage() {
  const navigate = useNavigate()
  const createTodo = useStore((state) => state.createTodo)
  const isLoading = useStore((state) => state.isLoading)
  const error = useStore((state) => state.error)

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Todo</h1>
          <p className="text-muted-foreground">Add a new task to your todo list</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <TodoForm
          isLoading={isLoading}
          onSubmit={async (data) => {
            await createTodo(data)
            if (!useStore.getState().error) await navigate({ to: '/todos' })
          }}
          onCancel={() => void navigate({ to: '/todos' })}
        />
        {error && <p role="alert">{error}</p>}
      </div>
    </div>
  )
}
