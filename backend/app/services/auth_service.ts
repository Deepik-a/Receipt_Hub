import { inject } from '@adonisjs/core'
import { UserRepository } from '#interfaces/user_repository'
import User from '#models/user'
import OtpService from '#services/otp_service'
import MailService from '#services/mail_service'

@inject()
export default class AuthService {
  constructor(
    protected userRepository: UserRepository,
    protected otpService: OtpService,
    protected mailService: MailService
  ) {}

  async register(fullName: string, email: string, password: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email)
    if (existing) {
      throw new Error('Email is already registered')
    }

    return this.userRepository.create({ fullName, email, password, provider: 'email' })
  }

  async login(email: string, password: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email)
    if (existing && !existing.password) {
      throw new Error('This account uses Google sign-in. Please continue with Google.')
    }

    return User.verifyCredentials(email, password)
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      return
    }

    if (!user.password) {
      throw new Error('This account uses Google sign-in. Password reset is not available.')
    }

    const otp = await this.otpService.generate(email)
    await this.mailService.sendPasswordResetOtp(email, otp)
  }

  async resetPassword(email: string, otp: string, password: string): Promise<User> {
    const isValid = await this.otpService.verify(email, otp)
    if (!isValid) {
      throw new Error('Invalid or expired OTP')
    }

    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    return this.userRepository.updatePassword(user, password)
  }

  async findOrCreateGoogleUser(profile: {
    id: string
    email: string
    name: string
    avatarUrl: string | null
  }): Promise<User> {
    let user = await this.userRepository.findByGoogleId(profile.id)

    if (user) {
      return user
    }

    user = await this.userRepository.findByEmail(profile.email)

    if (user) {
      return this.userRepository.linkGoogleAccount(user, {
        googleId: profile.id,
        avatarUrl: profile.avatarUrl,
      })
    }

    return this.userRepository.createFromGoogle({
      fullName: profile.name,
      email: profile.email,
      googleId: profile.id,
      avatarUrl: profile.avatarUrl,
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
