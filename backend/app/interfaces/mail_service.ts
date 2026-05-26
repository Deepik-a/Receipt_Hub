export abstract class MailService {
  abstract sendRegistrationOtp(email: string, otp: string): Promise<void>
  abstract sendPasswordResetOtp(email: string, otp: string): Promise<void>
}
