import type { SpoonacularSearchParams, SpoonacularSearchResponse } from '#types/spoonacular'

export abstract class SpoonacularService {
  abstract searchRecipes(params: SpoonacularSearchParams): Promise<SpoonacularSearchResponse>
  abstract getRecipeInformation(
    recipeId: number,
    options?: { includeNutrition?: boolean }
  ): Promise<Record<string, unknown>>
}
