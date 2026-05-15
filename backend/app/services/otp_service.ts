import redis from '@adonisjs/redis/services/main'

const OTP_PREFIX = 'otp:password:'
const OTP_TTL_SECONDS = 600

export default class OtpService {
  async generate(email: string): Promise<string> {
    const otp = String(Math.floor(100000 + Math.random() * 900000))
    await redis.setex(`${OTP_PREFIX}${email}`, OTP_TTL_SECONDS, otp)
    return otp
  }

  async check(email: string, otp: string): Promise<boolean> {
    const stored = await redis.get(`${OTP_PREFIX}${email}`)
    return stored === otp
  }

  async verify(email: string, otp: string): Promise<boolean> {
    const valid = await this.check(email, otp)
    if (!valid) {
      return false
    }
    await redis.del(`${OTP_PREFIX}${email}`)
    return true
  }
}
