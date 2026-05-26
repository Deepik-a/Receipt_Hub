const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Uppercase, lowercase, digit, and special character */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

export const PASSWORD_RULE_MESSAGE =
  'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character'

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Email is required'
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address'
  }

  return undefined
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return 'Password is required'
  }

  if (!PASSWORD_PATTERN.test(value)) {
    return PASSWORD_RULE_MESSAGE
  }

  return undefined
}

export function validatePasswordForLogin(value: string): string | undefined {
  if (!value) {
    return 'Password is required'
  }

  return undefined
}

export function validateFullName(value: string): string | undefined {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Full name is required'
  }

  if (trimmed.length < 2) {
    return 'Full name must be at least 2 characters'
  }

  if (trimmed.length > 100) {
    return 'Full name must be at most 100 characters'
  }

  return undefined
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!confirmPassword) {
    return 'Please confirm your password'
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }

  return undefined
}

export function validateOtp(value: string): string | undefined {
  if (!value) {
    return 'Verification code is required'
  }

  if (!/^\d{6}$/.test(value)) {
    return 'Enter a valid 6-digit code'
  }

  return undefined
}
