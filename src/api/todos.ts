import '@/api/client'
import {
  todosArchiveCompleted,
  todosBulkDelete,
  todosBulkUpdate,
  todosCreate,
  todosDelete,
  todosGet,
  todosList,
  todosStats,
  todosToggle,
  todosUpdate,
} from '@/api/generated/sdk.gen'
import type { TodosListData } from '@/api/generated/types.gen'
import type {
  CreateTodoRequest,
  PaginatedResponse,
  QueryParams,
  Todo,
  TodoPriority,
  UpdateTodoRequest,
} from '@/types'

export const todoQueryKeys = {
  all: ['todos'] as const,
  lists: () => [...todoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...todoQueryKeys.lists(), params] as const,
  details: () => [...todoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoQueryKeys.details(), id] as const,
  stats: () => [...todoQueryKeys.all, 'stats'] as const,
  byPriority: (priority: string) => [...todoQueryKeys.all, 'priority', priority] as const,
  byStatus: (completed: boolean) => [...todoQueryKeys.all, 'status', completed] as const,
}

type TodoListParams = QueryParams & {
  priority?: TodoPriority
  completed?: boolean
  overdue?: boolean
  due_today?: boolean
}

const toListQuery = (params?: TodoListParams): NonNullable<TodosListData['query']> => ({
  page: params?.page,
  page_size: params?.page_size,
  search: params?.search,
  ordering: params?.ordering,
  priority: params?.priority,
  completed: params?.completed,
  overdue: params?.overdue,
  due_today: params?.due_today,
})

export const todosApi = {
  getTodos: async (params?: TodoListParams): Promise<PaginatedResponse<Todo>> => {
    const { data } = await todosList({ query: toListQuery(params), throwOnError: true })
    return data
  },

  getTodo: async (id: string): Promise<Todo> => {
    const { data } = await todosGet({ path: { id }, throwOnError: true })
    return data
  },

  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const { data } = await todosCreate({ body: todo, throwOnError: true })
    return data
  },

  updateTodo: async (id: string, updates: UpdateTodoRequest): Promise<Todo> => {
    const { data } = await todosUpdate({ path: { id }, body: updates, throwOnError: true })
    return data
  },

  deleteTodo: async (id: string): Promise<{ message: string }> => {
    const { data } = await todosDelete({ path: { id }, throwOnError: true })
    return data
  },

  toggleTodo: async (id: string): Promise<Todo> => {
    const { data } = await todosToggle({ path: { id }, throwOnError: true })
    return data
  },

  getStats: async (): Promise<{
    total: number
    completed: number
    pending: number
    overdue: number
    byPriority: Record<string, number>
  }> => {
    const { data } = await todosStats({ throwOnError: true })
    return data
  },

  getByPriority: async (
    priority: TodoPriority,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<Todo[]> => {
    const { data } = await todosList({
      query: toListQuery({ ...params, priority }),
      throwOnError: true,
    })
    return data.data
  },

  getByStatus: async (
    completed: boolean,
    params?: Omit<QueryParams, 'filters'>,
  ): Promise<Todo[]> => {
    const { data } = await todosList({
      query: toListQuery({ ...params, completed }),
      throwOnError: true,
    })
    return data.data
  },

  getOverdue: async (): Promise<Todo[]> => {
    const { data } = await todosList({ query: { overdue: true }, throwOnError: true })
    return data.data
  },

  getDueToday: async (): Promise<Todo[]> => {
    const { data } = await todosList({ query: { due_today: true }, throwOnError: true })
    return data.data
  },

  search: async (query: string, params?: Omit<QueryParams, 'filters'>): Promise<Todo[]> => {
    const { data } = await todosList({
      query: toListQuery({ ...params, search: query }),
      throwOnError: true,
    })
    return data.data
  },

  bulkUpdate: async (ids: string[], updates: UpdateTodoRequest): Promise<Todo[]> => {
    const { data } = await todosBulkUpdate({ body: { ids, ...updates }, throwOnError: true })
    return data
  },

  bulkDelete: async (ids: string[]): Promise<{ deletedCount: number }> => {
    const { data } = await todosBulkDelete({ body: { ids }, throwOnError: true })
    return data
  },

  archiveCompleted: async (): Promise<{ message: string; archivedCount: number }> => {
    const { data } = await todosArchiveCompleted({ throwOnError: true })
    return data
  },
}
