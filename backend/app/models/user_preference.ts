import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import type { UserPreferencesPayload } from '#types/user_preferences'

export default class UserPreference extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column({
    prepare: (value: UserPreferencesPayload) => JSON.stringify(value),
    consume: (value: string | UserPreferencesPayload) =>
      typeof value === 'string' ? (JSON.parse(value) as UserPreferencesPayload) : value,
  })
  declare preferences: UserPreferencesPayload

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
