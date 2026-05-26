import type { HttpContext } from '@adonisjs/core/http'
import FavoriteRecipe from '#models/favorite_recipe'
import { HttpStatus } from '#enums/http_status'
import { MESSAGES } from '#constants/messages'

export default class FavoritesController {
  async index({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const favorites = await FavoriteRecipe.query()
        .where('userId', user.id)
        .orderBy('createdAt', 'desc')
      return response.status(HttpStatus.OK).json({ results: favorites })
    } catch (error: any) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: error.message || 'Failed to fetch favorites' })
    }
  }

  async toggle({ request, auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { recipeId, title, image } = request.only(['recipeId', 'title', 'image'])

      if (!recipeId) {
        return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Recipe ID is required' })
      }

      const existing = await FavoriteRecipe.query()
        .where('userId', user.id)
        .where('recipeId', Number(recipeId))
        .first()

      if (existing) {
        await existing.delete()
        return response.status(HttpStatus.OK).json({ favorited: false, message: MESSAGES.RECIPES.FAVORITE_REMOVED })
      }

      const fav = await FavoriteRecipe.create({
        userId: user.id,
        recipeId: Number(recipeId),
        title: title || 'Unnamed Recipe',
        image: image || null,
      })

      return response.status(HttpStatus.CREATED).json({ favorited: true, favorite: fav, message: MESSAGES.RECIPES.FAVORITE_ADDED })
    } catch (error: any) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: error.message || 'Failed to toggle favorite' })
    }
  }

  async getIds({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const favorites = await FavoriteRecipe.query()
        .where('userId', user.id)
        .select('recipeId')
      const ids = favorites.map((f) => f.recipeId)
      return response.status(HttpStatus.OK).json(ids)
    } catch (error: any) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: error.message || 'Failed to fetch favorite IDs' })
    }
  }
}
