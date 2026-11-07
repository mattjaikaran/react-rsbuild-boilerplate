import type { AxiosStatic } from 'axios'
import axios from 'axios'
import { client } from '@/api/generated/client.gen'
import { env } from '@/config/env'
import { useStore } from '@/lib/store'

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token:v1')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && useStore.getState().isAuthenticated) {
      useStore.getState().logout()
      useStore.getState().setError('Your session has expired. Please sign in again.')
    }
    return Promise.reject(error)
  },
)

// The generated SDK calls this axios instance, so every generated request keeps
// the token and session-expiry interceptors configured above.
client.setConfig({
  axios: apiClient as AxiosStatic,
  baseURL: env.apiUrl,
})
