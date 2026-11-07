import '@/api/client'
import {
  authChangePassword,
  authLogin,
  authLogout,
  authMagicLink,
  authMe,
  authRefresh,
  authRegister,
  authRequestPasswordReset,
  authResetPassword,
  authUpdateMe,
  authVerifyMagicLink,
} from '@/api/generated/sdk.gen'
import type {
  AuthResponse,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await authLogin({ body: credentials, throwOnError: true })
    return data
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await authRegister({ body: credentials, throwOnError: true })
    return data
  },

  magicLink: async (request: MagicLinkRequest): Promise<{ message: string }> => {
    const { data } = await authMagicLink({ body: request, throwOnError: true })
    return data
  },

  verifyMagicLink: async (token: string): Promise<AuthResponse> => {
    const { data } = await authVerifyMagicLink({ body: { token }, throwOnError: true })
    return data
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      const { data } = await authLogout({ throwOnError: true })
      return data
    } catch {
      return { message: 'Logged out successfully' }
    }
  },

  getProfile: async (): Promise<User> => {
    const { data } = await authMe({ throwOnError: true })
    return data
  },

  getMe: async (): Promise<User> => {
    const { data } = await authMe({ throwOnError: true })
    return data
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await authUpdateMe({
      body: {
        email: updates.email,
        firstName: updates.firstName,
        lastName: updates.lastName,
        isActive: updates.isActive,
      },
      throwOnError: true,
    })
    return data
  },

  changePassword: async (payload: {
    currentPassword: string
    newPassword: string
  }): Promise<{ message: string }> => {
    const { data } = await authChangePassword({ body: payload, throwOnError: true })
    return data
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const { data } = await authRequestPasswordReset({ body: { email }, throwOnError: true })
    return data
  },

  resetPassword: async (payload: {
    token: string
    newPassword: string
  }): Promise<{ message: string }> => {
    const { data } = await authResetPassword({ body: payload, throwOnError: true })
    return data
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const { data } = await authRefresh({ body: { refreshToken }, throwOnError: true })
    return data
  },
}
