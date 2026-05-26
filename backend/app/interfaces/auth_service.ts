import User from '#models/user'
import type {
  RegisterUserDto,
  VerifyRegistrationDto,
  LoginUserDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  GoogleUserDto,
} from '#dtos/auth_dto'

export abstract class AuthService {
  abstract startRegistration(dto: RegisterUserDto): Promise<void>
  abstract completeRegistration(dto: VerifyRegistrationDto): Promise<User>
  abstract login(dto: LoginUserDto): Promise<User>
  abstract resendOtp(dto: ResendOtpDto): Promise<void>
  abstract forgotPassword(dto: ForgotPasswordDto): Promise<void>
  abstract resetPassword(dto: ResetPasswordDto): Promise<User>
  abstract findOrCreateGoogleUser(dto: GoogleUserDto): Promise<User>
  abstract serializeUser(user: User): Record<string, unknown>
}
