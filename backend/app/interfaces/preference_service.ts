import type { UserPreferencesPayload } from '#types/user_preferences'
import type { UpdatePreferencesDto } from '#dtos/user_dto'

export abstract class PreferenceService {
  abstract getForUser(userId: number): Promise<UserPreferencesPayload>
  abstract upsertForUser(
    userId: number,
    preferences: UpdatePreferencesDto
  ): Promise<UserPreferencesPayload>
}
