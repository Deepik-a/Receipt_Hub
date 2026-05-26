export interface RegisterUserDto {
  fullName: string
  email: string
  password?: string
  provider?: 'email' | 'google'
}

export interface VerifyRegistrationDto {
  email: string
  otp: string
}

export interface LoginUserDto {
  email: string
  password?: string
}

export interface ResendOtpDto {
  email: string
  purpose: 'register' | 'password_reset'
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  email: string
  otp: string
  password?: string
}

export interface GoogleUserDto {
  id: string
  email: string
  name: string
  avatarUrl: string | null
}
