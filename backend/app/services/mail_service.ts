import logger from '@adonisjs/core/services/logger'

export default class MailService {
  async sendPasswordResetOtp(email: string, otp: string): Promise<void> {
    /**
     * In development, log OTP to console. Wire SMTP (e.g. nodemailer) in production.
     */
    logger.info(`[Password reset] OTP for ${email}: ${otp}`)
  }
}
