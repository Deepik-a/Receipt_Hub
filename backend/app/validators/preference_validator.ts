import vine from '@vinejs/vine'

const stringArray = vine.array(vine.string().trim().minLength(1).maxLength(80)).maxLength(20)

export const updatePreferencesValidator = vine.compile(
  vine.object({
    cuisines: stringArray.optional(),
    diet: vine.string().trim().maxLength(50).optional(),
    intolerances: stringArray.optional(),
    maxReadyTime: vine.number().min(1).max(480).optional(),
    includeIngredients: stringArray.optional(),
    excludeIngredients: stringArray.optional(),
    type: vine.string().trim().maxLength(50).optional(),
  })
)
