export type PendingRegistration = {
  fullName: string
  email: string
  password: string
}

export abstract class PendingRegistrationService {
  abstract store(email: string, data: PendingRegistration): Promise<void>
  abstract get(email: string): Promise<PendingRegistration | null>
  abstract delete(email: string): Promise<void>
}
