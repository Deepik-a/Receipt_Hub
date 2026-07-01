export type UserPreferencesPayload = {
  cuisines?: string[] | null
  diet?: string | null
  intolerances?: string[] | null
  maxReadyTime?: number
  includeIngredients?: string[]
  excludeIngredients?: string[]
  type?: string
}
export const EMPTY_USER_PREFERENCES: UserPreferencesPayload = {}
