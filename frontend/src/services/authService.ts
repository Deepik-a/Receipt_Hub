import api from '@/services/api/axiosInstance'
import type {
  AuthTokenResponse,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/types/user'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api'

const authService = {
  async register(payload: RegisterRequest): Promise<AuthTokenResponse> {
    const response = await api.post<AuthTokenResponse>('/auth/register', payload)
    return response.data
  },

  async login(payload: LoginRequest): Promise<AuthTokenResponse> {
    const response = await api.post<AuthTokenResponse>('/auth/login', payload)
    return response.data
  },

  async me(): Promise<{ user: AuthUser }> {
    const response = await api.get<{ user: AuthUser }>('/auth/me')
    return response.data
  },

  async logout(): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/logout')
    return response.data
  },

  async forgotPassword(payload: ForgotPasswordRequest): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/forgot-password', payload)
    return response.data
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await api.post<VerifyOtpResponse>('/auth/verify-otp', payload)
    return response.data
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>('/auth/reset-password', payload)
    return response.data
  },

  googleLoginUrl(): string {
    return `${API_BASE}/auth/google`
  },
}

export default authService
