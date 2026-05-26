import redis from '@adonisjs/redis/services/main'
import type { OtpPurpose } from '#types/otp'

const OTP_TTL_SECONDS = 60
const RESEND_COOLDOWN_SECONDS = 60

const OTP_PREFIX: Record<OtpPurpose, string> = {
  register: 'otp:register:',
  password_reset: 'otp:password:',
}

import { OtpService as IOtpService } from '#interfaces/otp_service'

export default class OtpServiceImpl implements IOtpService {
  private _key(email: string, purpose: OtpPurpose) {
    return `${OTP_PREFIX[purpose]}${email.trim().toLowerCase()}`
  }

  private _cooldownKey(email: string, purpose: OtpPurpose) {
    return `otp:cooldown:${purpose}:${email.trim().toLowerCase()}`
  }

  async resendCooldownRemaining(email: string, purpose: OtpPurpose): Promise<number> {
    const ttl = await redis.ttl(this._cooldownKey(email, purpose))
    return ttl > 0 ? ttl : 0
  }

  async generate(email: string, purpose: OtpPurpose, mode: 'initial' | 'resend' = 'initial'): Promise<string> {
    if (mode === 'resend') {
      const remaining = await this.resendCooldownRemaining(email, purpose)
      if (remaining > 0) {
        throw new Error(`Please wait ${remaining} seconds before requesting a new code`)
      }
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    await redis.setex(this._key(email, purpose), OTP_TTL_SECONDS, otp)
    await redis.setex(this._cooldownKey(email, purpose), RESEND_COOLDOWN_SECONDS, '1')
    return otp
  }

  async check(email: string, otp: string, purpose: OtpPurpose): Promise<boolean> {
    const stored = await redis.get(this._key(email, purpose))
    return stored === otp
  }

  async verify(email: string, otp: string, purpose: OtpPurpose): Promise<boolean> {
    const valid = await this.check(email, otp, purpose)
    if (!valid) {
      return false
    }
    await this.delete(email, purpose)
    return true
  }

  async delete(email: string, purpose: OtpPurpose): Promise<void> {
    await redis.del(this._key(email, purpose))
  }
}
