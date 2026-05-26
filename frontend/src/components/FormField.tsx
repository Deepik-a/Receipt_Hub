import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react'
import { inputClass, inputErrorClass } from '@/components/authFormStyles'

type FormFieldProps = {
  name: string
  label: string
  type?: string | undefined
  placeholder?: string | undefined
  value: string
  error?: string | undefined
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: FocusEvent<HTMLInputElement>) => void
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'autoComplete' | 'inputMode'>

const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
  onBlur,
  autoComplete,
  inputMode,
}: FormFieldProps) => {
  const errorId = `${name}-error`

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder ?? label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={error ? inputErrorClass : inputClass}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
