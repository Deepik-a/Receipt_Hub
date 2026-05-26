import redis from '@adonisjs/redis/services/main'

const PENDING_PREFIX = 'pending:register:'
const PENDING_TTL_SECONDS = 600

import { PendingRegistrationService as IPendingRegistrationService, PendingRegistration } from '#interfaces/pending_registration_service'

export default class PendingRegistrationServiceImpl implements IPendingRegistrationService {
  private _key(email: string) {
    return `${PENDING_PREFIX}${email.trim().toLowerCase()}`
  }

  async store(email: string, data: PendingRegistration): Promise<void> {
    await redis.setex(this._key(email), PENDING_TTL_SECONDS, JSON.stringify(data))
  }

  async get(email: string): Promise<PendingRegistration | null> {
    const raw = await redis.get(this._key(email))
    if (!raw) {
      return null
    }

    return JSON.parse(raw) as PendingRegistration
  }

  async delete(email: string): Promise<void> {
    await redis.del(this._key(email))
  }
}
