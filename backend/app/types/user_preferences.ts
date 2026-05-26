export type UserPreferencesPayload = {
  cuisines?: string[]
  diet?: string
  intolerances?: string[]
  maxReadyTime?: number
  includeIngredients?: string[]
  excludeIngredients?: string[]
  type?: string
}

export const EMPTY_USER_PREFERENCES: UserPreferencesPayload = {}
