import { errors } from '@vinejs/vine'

export function resolveHttpErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof errors.E_VALIDATION_ERROR) {
    return error.messages[0]?.message ?? fallback
  }

  if (error instanceof Error) {
    const pgCode = 'code' in error ? String((error as { code?: string }).code) : ''

    if (pgCode === '42703') {
      return 'Server database is out of date. Please run migrations and try again.'
    }

    if (pgCode === '23505') {
      if (error.message.includes('email')) {
        return 'Email is already registered'
      }
      return 'This record already exists'
    }

    if (error.message.includes('column') && error.message.includes('does not exist')) {
      return 'Server database is out of date. Please run migrations and try again.'
    }

    return error.message
  }

  return fallback
}
