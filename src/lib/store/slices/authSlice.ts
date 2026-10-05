import { authApi } from '@/api/auth'
import type {
  AuthState,
  AuthTokens,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types'
import type { StateCreator } from 'zustand'

export interface AuthSlice extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  magicLink: (request: MagicLinkRequest) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  setUser: (user: User) => void
  setTokens: (tokens: AuthTokens) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  initializeAuth: () => void
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  ...initialState,
  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.login(credentials)
      get().setUser(response.user)
      get().setTokens(response.tokens)
      set({ isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Login failed' })
      throw error
    }
  },
  register: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.register(credentials)
      get().setUser(response.user)
      get().setTokens(response.tokens)
      set({ isLoading: false })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      })
      throw error
    }
  },
  magicLink: async (request) => {
    set({ isLoading: true, error: null })
    try {
      await authApi.magicLink(request)
      set({ isLoading: false })
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Magic link failed' })
      throw error
    }
  },
  logout: () => {
    localStorage.removeItem('auth_token:v1')
    localStorage.removeItem('refresh_token:v1')
    localStorage.removeItem('user:v1')
    set({ ...initialState })
  },
  refreshToken: async () => {
    const { tokens } = get()
    if (!tokens?.refreshToken) return
    set({ isLoading: true })
    try {
      const response = await authApi.refreshToken(tokens.refreshToken)
      get().setTokens({ ...tokens, accessToken: response.accessToken })
      set({ isLoading: false })
    } catch {
      get().logout()
      set({ error: 'Your session has expired. Please sign in again.' })
    }
  },
  setUser: (user) => {
    localStorage.setItem('user:v1', JSON.stringify(user))
    set({ user })
  },
  setTokens: (tokens) => {
    localStorage.setItem('auth_token:v1', tokens.accessToken)
    localStorage.setItem('refresh_token:v1', tokens.refreshToken)
    set({ tokens, isAuthenticated: true, error: null })
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  initializeAuth: () => {
    try {
      const accessToken = localStorage.getItem('auth_token:v1')
      const refreshToken = localStorage.getItem('refresh_token:v1')
      const userStr = localStorage.getItem('user:v1')
      if (accessToken && refreshToken && userStr) {
        const user: User = JSON.parse(userStr)
        set({ user, tokens: { accessToken, refreshToken }, isAuthenticated: true })
      }
    } catch {
      get().logout()
    }
  },
})
