import { inject } from '@adonisjs/core'
import UserPreference from '#models/user_preference'
import { EMPTY_USER_PREFERENCES, type UserPreferencesPayload } from '#types/user_preferences'

import { PreferenceService as IPreferenceService } from '#interfaces/preference_service'
import type { UpdatePreferencesDto } from '#dtos/user_dto'

@inject()
export default class PreferenceServiceImpl implements IPreferenceService {
  async getForUser(userId: number): Promise<UserPreferencesPayload> {
    const row = await UserPreference.findBy('userId', userId)
    return row?.preferences ?? { ...EMPTY_USER_PREFERENCES }
  }

  async upsertForUser(
    userId: number,
    preferences: UpdatePreferencesDto
  ): Promise<UserPreferencesPayload> {
    const row = await UserPreference.updateOrCreate({ userId }, { preferences })

    return row.preferences
  }
}
