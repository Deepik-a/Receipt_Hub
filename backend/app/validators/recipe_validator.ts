import vine from '@vinejs/vine'

export const recipeSearchValidator = vine.compile(
  vine.object({
    query: vine.string().trim().optional(),
    cuisine: vine.string().trim().optional(),
    diet: vine.string().trim().optional(),
    intolerances: vine.string().trim().optional(),
    includeIngredients: vine.string().trim().optional(),
    excludeIngredients: vine.string().trim().optional(),
    type: vine.string().trim().optional(),
    maxReadyTime: vine.number().min(1).max(480).optional(),
    number: vine.number().min(1).max(100).optional(),
    offset: vine.number().min(0).max(900).optional(),
    applyUserPreferences: vine.boolean().optional(),
  })
)

export const recipeIdValidator = vine.compile(
  vine.object({
    id: vine.number().positive(),
  })
)
