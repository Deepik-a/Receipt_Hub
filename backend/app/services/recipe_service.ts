import { inject } from '@adonisjs/core'
import SpoonacularService from '#services/spoonacular_service'
import PreferenceService from '#services/preference_service'
import type { SpoonacularSearchParams, SpoonacularSearchResponse } from '#types/spoonacular'
import type { UserPreferencesPayload } from '#types/user_preferences'

import type { RecipeSearchDto } from '#dtos/recipe_dto'
import { RecipeService as IRecipeService } from '#interfaces/recipe_service'

@inject()
export default class RecipeServiceImpl implements IRecipeService {
  constructor(
    private readonly _spoonacular: SpoonacularService,
    private readonly _preferenceService: PreferenceService
  ) {}

  async search(input: RecipeSearchDto, userId?: number): Promise<SpoonacularSearchResponse> {
    let params: SpoonacularSearchParams = {
      query: input.query,
      cuisine: input.cuisine,
      diet: input.diet,
      intolerances: input.intolerances,
      includeIngredients: input.includeIngredients,
      excludeIngredients: input.excludeIngredients,
      type: input.type,
      maxReadyTime: input.maxReadyTime,
      number: input.number ?? 12,
      offset: input.offset ?? 0,
      addRecipeInformation: true,
    }

    if (input.applyUserPreferences !== false && userId) {
      const prefs = await this._preferenceService.getForUser(userId)
      params = this._mergePreferences(params, prefs)
    }

    try {
      return await this._spoonacular.searchRecipes(params)
    } catch (error) {
      throw error
    }
  }

  async getById(recipeId: number, includeNutrition = false) {
    return this._spoonacular.getRecipeInformation(recipeId, { includeNutrition })
  }

  private _mergePreferences(
    params: SpoonacularSearchParams,
    prefs: UserPreferencesPayload
  ): SpoonacularSearchParams {
    return {
      ...params,
      query: params.query,
      cuisine: params.cuisine ?? this._joinList(prefs.cuisines),
      diet: params.diet ?? (prefs.diet ?? undefined),
      intolerances: params.intolerances ?? this._joinList(prefs.intolerances),
      includeIngredients: params.includeIngredients ?? this._joinList(prefs.includeIngredients),
      excludeIngredients: params.excludeIngredients ?? this._joinList(prefs.excludeIngredients),
      type: params.type ?? prefs.type,
      maxReadyTime: params.maxReadyTime ?? prefs.maxReadyTime,
    }
  }

  private _joinList(values?: string[] | null): string | undefined {
    if (!values?.length) {
      return undefined
    }
    return values.join(',')
  }
}