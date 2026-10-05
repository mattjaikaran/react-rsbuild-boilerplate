import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAuth, useAppConfig, useStore, useTodos, useUI } from './index'
import { authApi } from '@/api/auth'

describe('composite store selectors', () => {
  it('preserves selected object identity for an unrelated state update', () => {
    const { result } = renderHook(() => ({
      auth: useAuth(),
      todos: useTodos(),
      ui: useUI(),
      config: useAppConfig(),
    }))
    const previous = result.current
    const theme = useStore.getState().theme
    act(() => useStore.setState({ theme: theme === 'dark' ? 'light' : 'dark' }))
    expect(result.current.auth).toBe(previous.auth)
    expect(result.current.todos).toBe(previous.todos)
    expect(result.current.config).toBe(previous.config)
    expect(result.current.ui).not.toBe(previous.ui)
    act(() => useStore.setState({ theme }))
  })
})

describe('authentication state', () => {
  it('retains API-issued tokens rather than replacing them with mock credentials', async () => {
    const user = {
      id: 'test',
      email: 'reader@example.com',
      firstName: 'Reader',
      lastName: 'Test',
      isActive: true,
      createdAt: '',
      updatedAt: '',
    }
    const tokens = { accessToken: 'issued-access', refreshToken: 'issued-refresh' }
    const login = vi.spyOn(authApi, 'login').mockResolvedValue({ user, tokens })
    try {
      await useStore.getState().login({ email: user.email, password: 'password' })
      expect(useStore.getState().tokens).toEqual(tokens)
      expect(localStorage.getItem('auth_token:v1')).toBe(tokens.accessToken)
      expect(useStore.getState().isAuthenticated).toBe(true)
    } finally {
      login.mockRestore()
      useStore.getState().logout()
    }
  })

  it('clears browser credentials when refresh fails', async () => {
    useStore.getState().setTokens({ accessToken: 'expired', refreshToken: 'invalid' })
    const refresh = vi.spyOn(authApi, 'refreshToken').mockRejectedValue(new Error('Rejected'))
    try {
      await useStore.getState().refreshToken()
      expect(useStore.getState().isAuthenticated).toBe(false)
      expect(useStore.getState().tokens).toBeNull()
      expect(localStorage.getItem('auth_token:v1')).toBeNull()
      expect(localStorage.getItem('refresh_token:v1')).toBeNull()
      expect(useStore.getState().error).toContain('session has expired')
    } finally {
      refresh.mockRestore()
      useStore.getState().logout()
    }
  })
})
