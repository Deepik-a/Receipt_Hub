import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    password: vine.string().minLength(8),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().email().trim().toLowerCase(),
    password: vine.string().minLength(8).maxLength(72),
    confirmPassword: vine.string().minLength(8).maxLength(72),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    otp: vine.string().fixedLength(6),
    password: vine.string().minLength(8).maxLength(72),
    confirmPassword: vine.string().minLength(8).maxLength(72),
  })
)

export const verifyOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().toLowerCase(),
    otp: vine.string().fixedLength(6),
  })
)
