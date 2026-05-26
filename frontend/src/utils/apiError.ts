import axios from 'axios'

type ApiErrorBody = {
  message?: string
  error?: string
  errors?: Array<{ message?: string; field?: string }>
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err.message : fallback
  }

  const data = err.response?.data as ApiErrorBody | string | undefined

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (!data || typeof data !== 'object') {
    return fallback
  }

  if (data.message) {
    return data.message
  }

  if (data.error) {
    return data.error
  }

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((item) => item.message ?? item.field)
      .filter(Boolean)
      .join('. ')
  }

  return fallback
}
