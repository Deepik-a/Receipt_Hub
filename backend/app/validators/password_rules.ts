import vine from '@vinejs/vine'

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 72

/** Uppercase, lowercase, digit, and special character */
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

export const PASSWORD_RULE_MESSAGE =
  'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character'

const strongPasswordRule = vine.createRule((value, _, field) => {
  if (typeof value !== 'string') {
    return
  }

  if (!PASSWORD_PATTERN.test(value)) {
    field.report(PASSWORD_RULE_MESSAGE, 'strongPassword', field)
  }
})

export function passwordRule() {
  return vine
    .string()
    .minLength(PASSWORD_MIN_LENGTH)
    .maxLength(PASSWORD_MAX_LENGTH)
    .use(strongPasswordRule())
}
