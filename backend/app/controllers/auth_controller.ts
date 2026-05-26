import { Buffer } from 'node:buffer'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import { AuthService } from '#interfaces/auth_service'
import { OtpService } from '#interfaces/otp_service'
import { HttpStatus } from '#enums/http_status'
import { MESSAGES } from '#constants/messages'
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifyOtpValidator,
  verifyRegistrationValidator,
  resendOtpValidator,
} from '#validators/auth_validator'
import { resolveHttpErrorMessage } from '#services/http_errors'

@inject()
export default class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _otpService: OtpService
  ) {}

  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      if (payload.password !== payload.confirmPassword) {
        return response.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH })
      }

      await this._authService.startRegistration({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
      })

      const email = payload.email.trim().toLowerCase()

      return response.status(HttpStatus.CREATED).json({
        message: MESSAGES.AUTH.VERIFICATION_CODE_SENT,
        email,
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: resolveHttpErrorMessage(error, MESSAGES.AUTH.REGISTRATION_FAILED),
      })
    }
  }

  async verifyRegistration({ request, response, auth }: HttpContext) {
    try {
      const { email, otp } = await request.validateUsing(verifyRegistrationValidator)
      const user = await this._authService.completeRegistration({ email, otp })
      const token = await auth.use('api').createToken(user)

      return response.status(HttpStatus.OK).json({
        message: MESSAGES.AUTH.REGISTRATION_SUCCESS,
        token: token.value!.release(),
        user: this._authService.serializeUser(user),
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: resolveHttpErrorMessage(error, MESSAGES.AUTH.VERIFICATION_FAILED),
      })
    }
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      const user = await this._authService.login({ email, password })
      const token = await auth.use('api').createToken(user)

      return response.status(HttpStatus.OK).json({
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
        token: token.value!.release(),
        user: this._authService.serializeUser(user),
      })
    } catch (error) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        message: resolveHttpErrorMessage(error, MESSAGES.AUTH.INVALID_CREDENTIALS),
      })
    }
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    return response.status(HttpStatus.OK).json({
      user: this._authService.serializeUser(user),
    })
  }

  async logout({ auth, response }: HttpContext) {
    auth.getUserOrFail()
    await auth.use('api').invalidateToken()
    return response.status(HttpStatus.OK).json({ message: MESSAGES.AUTH.LOGOUT_SUCCESS })
  }

  async resendOtp({ request, response }: HttpContext) {
    try {
      const { email, purpose } = await request.validateUsing(resendOtpValidator)
      await this._authService.resendOtp({ email, purpose })

      return response.status(HttpStatus.OK).json({
        message: MESSAGES.AUTH.NEW_CODE_SENT,
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: resolveHttpErrorMessage(error, MESSAGES.AUTH.RESEND_CODE_FAILED),
      })
    }
  }

  async forgotPassword({ request, response }: HttpContext) {
    try {
      const { email } = await request.validateUsing(forgotPasswordValidator)
      await this._authService.forgotPassword({ email })

      return response.status(HttpStatus.OK).json({
        message: MESSAGES.AUTH.RESET_CODE_SENT,
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: resolveHttpErrorMessage(error, MESSAGES.AUTH.SEND_RESET_CODE_FAILED),
      })
    }
  }

  async verifyOtp({ request, response }: HttpContext) {
    try {
      const { email, otp, purpose = 'password_reset' } =
        await request.validateUsing(verifyOtpValidator)
      const valid = await this._otpService.check(email, otp, purpose)

      if (!valid) {
        return response.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.AUTH.INVALID_OTP })
      }

      return response.status(HttpStatus.OK).json({ message: MESSAGES.AUTH.OTP_VERIFIED, valid: true })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: resolveHttpErrorMessage(error, MESSAGES.AUTH.INVALID_OTP),
      })
    }
  }

  async resetPassword({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(resetPasswordValidator)

      if (payload.password !== payload.confirmPassword) {
        return response.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH })
      }

      const user = await this._authService.resetPassword({
        email: payload.email,
        otp: payload.otp,
        password: payload.password,
      })

      return response.status(HttpStatus.OK).json({
        message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESS,
        user: this._authService.serializeUser(user),
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: resolveHttpErrorMessage(error, MESSAGES.AUTH.PASSWORD_RESET_FAILED),
      })
    }
  }

  async googleRedirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  async googleCallback({ ally, auth, response }: HttpContext) {
    const frontendBase = env.get('FRONTEND_URL').replace(/\/+$/, '')

    try {
      const google = ally.use('google')

      if (google.accessDenied()) {
        return response.redirect(`${frontendBase}/login?error=access_denied`)
      }

      if (google.stateMisMatch()) {
        return response.redirect(`${frontendBase}/login?error=state_mismatch`)
      }

      const googleUser = await google.user()

      const user = await this._authService.findOrCreateGoogleUser({
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.avatarUrl,
      })

      const token = await auth.use('api').createToken(user)
      const tokenValue = token.value!.release()

      const profile = Buffer.from(
        JSON.stringify(this._authService.serializeUser(user)),
        'utf8'
      ).toString('base64url')

      const params = new URLSearchParams({ token: tokenValue, profile })

      return response.redirect(`${frontendBase}/auth/callback?${params.toString()}`)
    } catch {
      return response.redirect(`${frontendBase}/login?error=google_auth_failed`)
    }
  }
}
