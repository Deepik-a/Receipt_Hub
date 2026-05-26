import type { OtpPurpose } from '#types/otp'

export abstract class OtpService {
  abstract resendCooldownRemaining(email: string, purpose: OtpPurpose): Promise<number>
  abstract generate(
    email: string,
    purpose: OtpPurpose,
    mode?: 'initial' | 'resend'
  ): Promise<string>
  abstract check(email: string, otp: string, purpose: OtpPurpose): Promise<boolean>
  abstract verify(email: string, otp: string, purpose: OtpPurpose): Promise<boolean>
  abstract delete(email: string, purpose: OtpPurpose): Promise<void>
}
