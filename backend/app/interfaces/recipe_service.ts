import type { SpoonacularSearchResponse } from '#types/spoonacular'
import type { RecipeSearchDto } from '#dtos/recipe_dto'

export abstract class RecipeService {
  abstract search(input: RecipeSearchDto, userId?: number): Promise<SpoonacularSearchResponse>
  abstract getById(recipeId: number, includeNutrition?: boolean): Promise<Record<string, unknown>>
}
