export interface AuthUser {
  id: number
  fullName: string | null
  email: string
  avatarUrl?: string | null
  provider?: 'email' | 'google'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  password: string
  confirmPassword: string
}

export interface AuthTokenResponse {
  message: string
  token: string
  user: AuthUser
}

export interface MessageResponse {
  message: string
}

export interface VerifyOtpResponse {
  message: string
  valid: boolean
}
