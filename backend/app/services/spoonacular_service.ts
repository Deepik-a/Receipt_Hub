import { inject } from '@adonisjs/core'
import env from '#start/env'
import spoonacularConfig from '#config/spoonacular'
import type { SpoonacularSearchParams, SpoonacularSearchResponse } from '#types/spoonacular'

export class SpoonacularApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number
  ) {
    super(message)
    this.name = 'SpoonacularApiError'
  }
}

import { SpoonacularService as ISpoonacularService } from '#interfaces/spoonacular_service'

@inject()
export default class SpoonacularServiceImpl implements ISpoonacularService {
  private get _apiKey(): string {
    const key = env.get('SPOONACULAR_API_KEY')

    if (!key) {
      throw new SpoonacularApiError('Spoonacular API key is not configured', 503)
    }

    return key
  }

  async searchRecipes(params: SpoonacularSearchParams): Promise<SpoonacularSearchResponse> {
    const url = this._buildUrl('/recipes/complexSearch', {
      ...params,
      addRecipeInformation: params.addRecipeInformation ?? true,
    })

    return this._request<SpoonacularSearchResponse>(url)
  }

  async getRecipeInformation(
    recipeId: number,
    options: { includeNutrition?: boolean } = {}
  ): Promise<Record<string, unknown>> {
    const url = this._buildUrl(`/recipes/${recipeId}/information`, {
      includeNutrition: options.includeNutrition ?? false,
    })

    return this._request<Record<string, unknown>>(url)
  }

  private _buildUrl(
    path: string,
    params: Record<string, string | number | boolean | undefined>
  ): URL {
    const url = new URL(`${spoonacularConfig.baseUrl}${path}`)

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') {
        continue
      }

      url.searchParams.set(key, String(value))
    }

    url.searchParams.set('apiKey', this._apiKey)

    return url
  }

  private async _request<T>(url: URL): Promise<T> {
    const response = await fetch(url)

    if (!response.ok) {
      let message = `Spoonacular API error (${response.status})`

      try {
        const body = (await response.json()) as { message?: string; status?: string }
        message = body.message ?? body.status ?? message
      } catch {
        // ignore parse errors
      }

      throw new SpoonacularApiError(message, response.status)
    }

    return (await response.json()) as T
  }
}
