import { useCallback, useMemo, useState } from 'react'
import type { ChangeEvent, FocusEvent } from 'react'

type Validator<T extends Record<string, string>> = (
  value: string,
  values: T
) => string | undefined

type UseFormValidationOptions<T extends Record<string, string>> = {
  initialValues: T
  validators: Partial<Record<keyof T, Validator<T>>>
  relatedFields?: Partial<Record<keyof T, (keyof T)[]>>
}

export function useFormValidation<T extends Record<string, string>>({
  initialValues,
  validators,
  relatedFields = {},
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const validateField = useCallback(
    (name: keyof T, fieldValue: string, allValues: T): string | undefined => {
      const validator = validators[name]
      return validator ? validator(fieldValue, allValues) : undefined
    },
    [validators]
  )

  const collectErrors = useCallback(
    (allValues: T, fields: (keyof T)[]) => {
      const next: Partial<Record<keyof T, string>> = {}

      for (const field of fields) {
        const message = validateField(field, allValues[field], allValues)
        if (message) {
          next[field] = message
        }
      }

      return next
    },
    [validateField]
  )

  const applyErrors = (fields: (keyof T)[], fieldErrors: Partial<Record<keyof T, string>>) => {
    setErrors((prev) => {
      const merged = { ...prev }
      for (const field of fields) {
        if (fieldErrors[field]) {
          merged[field] = fieldErrors[field]
        } else {
          delete merged[field]
        }
      }
      return merged
    })
  }

  const getFieldError = (name: keyof T) =>
    touched[name] || submitAttempted ? errors[name] : undefined

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof T
    const nextValues = { ...values, [name]: e.target.value } as T

    setValues(nextValues)

    const fieldsToCheck = [name, ...(relatedFields[name] ?? [])]
    const activeFields = fieldsToCheck.filter((field) => touched[field] || submitAttempted)

    if (activeFields.length > 0) {
      applyErrors(activeFields, collectErrors(nextValues, activeFields))
    }
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof T

    setTouched((prev) => ({ ...prev, [name]: true }))

    const fieldsToCheck = [name, ...(relatedFields[name] ?? [])]
    applyErrors(fieldsToCheck, collectErrors(values, fieldsToCheck))
  }

  const validateAll = (): boolean => {
    setSubmitAttempted(true)

    const allTouched = Object.keys(validators).reduce(
      (acc, key) => {
        acc[key as keyof T] = true
        return acc
      },
      {} as Partial<Record<keyof T, boolean>>
    )
    setTouched(allTouched)

    const fields = Object.keys(validators) as (keyof T)[]
    const allErrors = collectErrors(values, fields)

    setErrors(allErrors)
    return Object.keys(allErrors).length === 0
  }

  const isFormValid = useMemo(() => {
    const fields = Object.keys(validators) as (keyof T)[]
    return fields.every((field) => !validateField(field, values[field], values))
  }, [validateField, validators, values])

  return {
    values,
    setValues,
    handleChange,
    handleBlur,
    validateAll,
    getFieldError,
    isFormValid,
  }
}
