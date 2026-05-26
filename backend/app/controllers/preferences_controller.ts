import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { PreferenceService } from '#interfaces/preference_service'
import { updatePreferencesValidator } from '#validators/preference_validator'
import { HttpStatus } from '#enums/http_status'
import { MESSAGES } from '#constants/messages'

@inject()
export default class PreferencesController {
  constructor(private readonly _preferenceService: PreferenceService) {}

  async show({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const preferences = await this._preferenceService.getForUser(user.id)

    return response.status(HttpStatus.OK).json({ preferences })
  }

  async update({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updatePreferencesValidator)
    const preferences = await this._preferenceService.upsertForUser(user.id, payload)

    return response.status(HttpStatus.OK).json({
      message: MESSAGES.USER.PREFERENCES_UPDATED,
      preferences,
    })
  }
}
