import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import { buildOtpEmail, type OtpEmailVariant } from '#templates/otp_email_template'

export class MailDeliveryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MailDeliveryError'
  }
}

import { MailService as IMailService } from '#interfaces/mail_service'

export default class MailServiceImpl implements IMailService {
  private _transporter: Transporter | null = null
  private _verified = false

  private _isSmtpConfigured(): boolean {
    const host = env.get('SMTP_HOST')?.trim()
    const user = env.get('SMTP_USER')?.trim()
    const pass = env.get('SMTP_PASSWORD')?.trim()
    return Boolean(host && user && pass)
  }

  private _getTransporter(): Transporter {
    if (this._transporter) {
      return this._transporter
    }

    const host = env.get('SMTP_HOST')!.trim()
    const user = env.get('SMTP_USER')!.trim()
    const pass = env.get('SMTP_PASSWORD')!.trim()

    this._transporter = nodemailer.createTransport({
      host,
      port: env.get('SMTP_PORT') ?? 587,
      secure: env.get('SMTP_SECURE') ?? false,
      auth: { user, pass },
    })

    return this._transporter
  }

  private async _ensureTransporterReady(): Promise<Transporter> {
    if (!this._isSmtpConfigured()) {
      throw new MailDeliveryError(
        'Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in backend/.env'
      )
    }

    const transporter = this._getTransporter()

    if (!this._verified) {
      try {
        await transporter.verify()
        this._verified = true
        logger.info('[Mail] SMTP connection verified')
      } catch (error) {
        const detail = error instanceof Error ? error.message : 'Unknown SMTP error'
        throw new MailDeliveryError(
          `Could not connect to email server. Check SMTP settings. (${detail})`
        )
      }
    }

    return transporter
  }

  private _parseFromAddress(): string {
    const raw = env.get('MAIL_FROM') ?? 'Recipe Hub <noreply@recipehub.com>'
    return raw.replace(/^["']|["']$/g, '').trim()
  }

  private async _sendOtpEmail(to: string, otp: string, variant: OtpEmailVariant): Promise<void> {
    const frontendUrl = env.get('FRONTEND_URL')
    const { subject, html, text } = buildOtpEmail({
      otp,
      variant,
      frontendUrl,
      recipientEmail: to,
    })

    if (!this._isSmtpConfigured()) {
      logger.warn(
        `[Mail] SMTP not configured — OTP for ${to} (${variant}): ${otp}\n` +
          `Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in backend/.env and restart the server.`
      )
      if (env.get('NODE_ENV') === 'production') {
        throw new MailDeliveryError(
          'Email delivery is not configured on the server. Contact support or try again later.'
        )
      }
      return
    }

    const transporter = await this._ensureTransporterReady()
    const from = this._parseFromAddress()

    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      })

      logger.info(`[Mail] Sent "${subject}" to ${to} (messageId: ${info.messageId})`)
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Send failed'
      logger.error({ err: error }, `[Mail] Failed to send to ${to}`)
      throw new MailDeliveryError(`Failed to send email. ${detail}`)
    }
  }

  async sendRegistrationOtp(email: string, otp: string): Promise<void> {
    await this._sendOtpEmail(email, otp, 'register')
  }

  async sendPasswordResetOtp(email: string, otp: string): Promise<void> {
    await this._sendOtpEmail(email, otp, 'password_reset')
  }
}
