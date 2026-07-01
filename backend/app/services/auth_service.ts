import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'
import { UserRepository } from '#interfaces/user_repository'
import User from '#models/user'
import OtpService from '#services/otp_service'
import MailService from '#services/mail_service'
import PendingRegistrationService from '#services/pending_registration_service'


import { AuthService } from '#interfaces/auth_service'
import type {
  RegisterUserDto,
  VerifyRegistrationDto,
  LoginUserDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  GoogleUserDto,
} from '#dtos/auth_dto'

@inject()
export default class AuthServiceImpl implements AuthService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _otpService: OtpService,
    private readonly _mailService: MailService,
    private readonly _pendingRegistration: PendingRegistrationService
  ) {}

  async startRegistration(dto: RegisterUserDto): Promise<void> {
    const normalizedEmail = dto.email.trim().toLowerCase()
    const existing = await this._userRepository.findByEmail(normalizedEmail)
    if (existing) {
      throw new Error('Email is already registered')
    }

    await this._pendingRegistration.store(normalizedEmail, {
      fullName: dto.fullName.trim(),
      email: normalizedEmail,
      password: dto.password!,
    })

    const otp = await this._otpService.generate(normalizedEmail, 'register')

    try {
      await this._mailService.sendRegistrationOtp(normalizedEmail, otp)
    } catch (error) {
      await this._pendingRegistration.delete(normalizedEmail)
      await this._otpService.delete(normalizedEmail, 'register')
      throw error
    }
  }

  async completeRegistration(dto: VerifyRegistrationDto): Promise<User> {
    const normalizedEmail = dto.email.trim().toLowerCase()
    const valid = await this._otpService.verify(normalizedEmail, dto.otp, 'register')
    if (!valid) {
      throw new Error('Invalid or expired OTP')
    }

    const pending = await this._pendingRegistration.get(normalizedEmail)
    if (!pending) {
      throw new Error('Registration session expired. Please sign up again.')
    }

    const user = await this._userRepository.create({
      fullName: pending.fullName,
      email: pending.email,
      password: pending.password,
      provider: 'email',
    })

    await this._pendingRegistration.delete(normalizedEmail)

    return user
  }

  async login(dto: LoginUserDto): Promise<User> {
    const existing = await this._userRepository.findByEmail(dto.email.trim().toLowerCase())
    if (existing && !existing.password) {
      throw new Error('This account uses Google sign-in. Please continue with Google.')
    }

    return User.verifyCredentials(dto.email.trim().toLowerCase(), dto.password!)
  }

  async resendOtp(dto: ResendOtpDto): Promise<void> {
    const normalizedEmail = dto.email.trim().toLowerCase()

    if (dto.purpose === 'register') {
      const pending = await this._pendingRegistration.get(normalizedEmail)
      if (!pending) {
        throw new Error('Registration session expired. Please sign up again.')
      }

      const otp = await this._otpService.generate(normalizedEmail, 'register', 'resend')
      await this._mailService.sendRegistrationOtp(normalizedEmail, otp)
      return
    }

    const user = await this._userRepository.findByEmail(normalizedEmail)
    if (!user) {
      throw new Error('No account found with this email address')
    }

    if (!user.password) {
      throw new Error('This account uses Google sign-in. Password reset is not available.')
    }

    const otp = await this._otpService.generate(normalizedEmail, 'password_reset', 'resend')
    await this._mailService.sendPasswordResetOtp(normalizedEmail, otp)
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const normalizedEmail = dto.email.trim().toLowerCase()
    const user = await this._userRepository.findByEmail(normalizedEmail)
    if (!user) {
      throw new Error('No account found with this email address')
    }

    if (!user.password) {
      throw new Error('This account uses Google sign-in. Password reset is not available.')
    }

    const otp = await this._otpService.generate(normalizedEmail, 'password_reset')
    await this._mailService.sendPasswordResetOtp(normalizedEmail, otp)
  }

  async resetPassword(dto: ResetPasswordDto): Promise<User> {
    const normalizedEmail = dto.email.trim().toLowerCase()
    const isValid = await this._otpService.verify(normalizedEmail, dto.otp, 'password_reset')
    if (!isValid) {
      throw new Error('Invalid or expired OTP')
    }

    const user = await this._userRepository.findByEmail(normalizedEmail)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.password) {
      const isSamePassword = await hash.verify(user.password, dto.password!)
      if (isSamePassword) {
        throw new Error('New password must be different from your current password')
      }
    }

    return this._userRepository.updatePassword(user, dto.password!)
  }

  async findOrCreateGoogleUser(dto: GoogleUserDto): Promise<User> {
    let user = await this._userRepository.findByGoogleId(dto.id)

    if (user) {
      return user
    }

    user = await this._userRepository.findByEmail(dto.email)

    if (user) {
      return this._userRepository.linkGoogleAccount(user, {
        googleId: dto.id,
        avatarUrl: dto.avatarUrl,
      })
    }

    return this._userRepository.createFromGoogle({
      fullName: dto.name,
      email: dto.email,
      googleId: dto.id,
      avatarUrl: dto.avatarUrl,
    })
  }

  serializeUser(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
    }
  }
}
