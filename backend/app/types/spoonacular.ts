export type SpoonacularSearchParams = {
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
  addRecipeInformation?: boolean
  fillIngredients?: boolean
}

export type SpoonacularRecipeSummary = {
  id: number
  title: string
  image: string
  imageType?: string
  readyInMinutes?: number
  servings?: number
}

export type SpoonacularSearchResponse = {
  offset: number
  number: number
  totalResults: number
  results: SpoonacularRecipeSummary[]
}
