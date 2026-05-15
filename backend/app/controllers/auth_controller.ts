import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import AuthService from '#services/auth_service'
import OtpService from '#services/otp_service'
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifyOtpValidator,
} from '#validators/auth_validator'

@inject()
export default class AuthController {
  constructor(
    protected authService: AuthService,
    protected otpService: OtpService
  ) {}

  async register({ request, response, auth }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      if (payload.password !== payload.confirmPassword) {
        return response.badRequest({ message: 'Passwords do not match' })
      }

      const user = await this.authService.register(
        payload.fullName,
        payload.email,
        payload.password
      )

      const token = await auth.use('api').createToken(user)

      return response.created({
        message: 'Registration successful',
        token: token.value!.release(),
        user: this.authService.serializeUser(user),
      })
    } catch (error) {
      return response.badRequest({
        message: error instanceof Error ? error.message : 'Registration failed',
      })
    }
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      const user = await this.authService.login(email, password)
      const token = await auth.use('api').createToken(user)

      return response.ok({
        message: 'Login successful',
        token: token.value!.release(),
        user: this.authService.serializeUser(user),
      })
    } catch (error) {
      return response.unauthorized({
        message: error instanceof Error ? error.message : 'Invalid credentials',
      })
    }
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.ok({
      user: this.authService.serializeUser(user),
    })
  }

  async logout({ auth, response }: HttpContext) {
    auth.getUserOrFail()
    await auth.use('api').invalidateToken()
    return response.ok({ message: 'Logged out successfully' })
  }

  async forgotPassword({ request, response }: HttpContext) {
    try {
      const { email } = await request.validateUsing(forgotPasswordValidator)
      await this.authService.forgotPassword(email)

      return response.ok({
        message: 'If an account exists for this email, a reset code has been sent.',
      })
    } catch (error) {
      return response.badRequest({
        message: error instanceof Error ? error.message : 'Unable to send reset code',
      })
    }
  }

  async verifyOtp({ request, response }: HttpContext) {
    const { email, otp } = await request.validateUsing(verifyOtpValidator)
    const valid = await this.otpService.check(email, otp)

    if (!valid) {
      return response.badRequest({ message: 'Invalid or expired OTP' })
    }

    return response.ok({ message: 'OTP verified', valid: true })
  }

  async resetPassword({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(resetPasswordValidator)

      if (payload.password !== payload.confirmPassword) {
        return response.badRequest({ message: 'Passwords do not match' })
      }

      const user = await this.authService.resetPassword(
        payload.email,
        payload.otp,
        payload.password
      )

      return response.ok({
        message: 'Password reset successful',
        user: this.authService.serializeUser(user),
      })
    } catch (error) {
      return response.badRequest({
        message: error instanceof Error ? error.message : 'Password reset failed',
      })
    }
  }

  async googleRedirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  async googleCallback({ ally, auth, response }: HttpContext) {
    try {
      const google = ally.use('google')

      if (google.accessDenied()) {
        return response.redirect(`${env.get('FRONTEND_URL')}/login?error=access_denied`)
      }

      if (google.stateMisMatch()) {
        return response.redirect(`${env.get('FRONTEND_URL')}/login?error=state_mismatch`)
      }

      const googleUser = await google.user()

      const user = await this.authService.findOrCreateGoogleUser({
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.avatarUrl,
      })

      const token = await auth.use('api').createToken(user)
      const tokenValue = token.value!.release()

      return response.redirect(
        `${env.get('FRONTEND_URL')}/auth/callback?token=${encodeURIComponent(tokenValue)}`
      )
    } catch {
      return response.redirect(`${env.get('FRONTEND_URL')}/login?error=google_auth_failed`)
    }
  }
}
