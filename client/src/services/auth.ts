import apiClient from './api'

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface RefreshTokenResponse {
  token: string
}

export async function login(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/login', credentials)
  return response.data
}

export async function register(
  data: RegisterRequest
): Promise<AuthResponse> {
  const response = await apiClient.post('/auth/register', data)
  return response.data
}

export async function refreshToken(
  currentToken: string
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post(
    '/auth/refresh',
    {},
    {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    }
  )
  return response.data
}

export async function getProfile(): Promise<User> {
  const response = await apiClient.get('/auth/profile')
  return response.data
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}
