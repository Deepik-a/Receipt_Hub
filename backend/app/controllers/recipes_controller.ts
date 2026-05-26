import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { RecipeService } from '#interfaces/recipe_service'
import { SpoonacularApiError } from '#services/spoonacular_service'
import { recipeIdValidator, recipeSearchValidator } from '#validators/recipe_validator'
import { HttpStatus } from '#enums/http_status'


@inject()
export default class RecipesController {
  constructor(private readonly _recipeService: RecipeService) {}

  async search({ request, response, auth }: HttpContext) {
    try {
      const filters = await request.validateUsing(recipeSearchValidator, {
        data: request.qs(),
      })



      const userId = auth.user?.id
      const results = await this._recipeService.search(
        {
          query: filters.query,
          cuisine: filters.cuisine,
          diet: filters.diet,
          intolerances: filters.intolerances,
          includeIngredients: filters.includeIngredients,
          excludeIngredients: filters.excludeIngredients,
          type: filters.type,
          maxReadyTime: filters.maxReadyTime,
          number: filters.number,
          offset: filters.offset,
          applyUserPreferences: filters.applyUserPreferences,
        },
        userId
      )

      return response.status(HttpStatus.OK).json(results)
    } catch (error) {
      return this.handleSpoonacularError(response, error, 'Recipe search failed')
    }
  }

  async show({ request, response, params }: HttpContext) {
    try {
      const { id } = await request.validateUsing(recipeIdValidator, {
        data: { id: Number(params.id) },
      })

      const includeNutrition = request.input('includeNutrition', false) === true
      const recipe = await this._recipeService.getById(id, includeNutrition)

      return response.status(HttpStatus.OK).json({ recipe })
    } catch (error) {
      return this.handleSpoonacularError(response, error, 'Failed to load recipe')
    }
  }

  private handleSpoonacularError(
    response: HttpContext['response'],
    error: unknown,
    fallbackMessage: string
  ) {
    if (error instanceof SpoonacularApiError) {
      if (error.statusCode === 402) {
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Recipe service quota exceeded. Please try again later.',
        })
      }

      return response.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      })
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error instanceof Error ? error.message : fallbackMessage,
    })
  }
}
