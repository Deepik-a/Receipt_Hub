export interface RecipeSearchDto {
  query?: string
  cuisine?: string
  diet?: string
  intolerances?: string
  includeIngredients?: string
  excludeIngredients?: string
  type?: string
  maxReadyTime?: number
  number?: number
  offset?: number
  applyUserPreferences?: boolean
}
