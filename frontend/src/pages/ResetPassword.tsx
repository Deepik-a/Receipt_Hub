import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '@/components/AuthLayout'
import PasswordField from '@/components/PasswordField'
import { primaryBtnClass } from '@/components/authFormStyles'
import { useFormValidation } from '@/hooks/useFormValidation'
import authService from '@/services/authService'
import { getApiErrorMessage } from '@/utils/apiError'
import { validateConfirmPassword, validatePassword } from '@/utils/authValidation'

type ResetLocationState = {
  email?: string
  otp?: string
  message?: string
}

type PasswordForm = {
  password: string
  confirmPassword: string
}

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = (location.state as ResetLocationState | null) ?? {}

  const email = routeState.email ?? ''
  const otp = routeState.otp ?? ''

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(routeState.message ?? null)

  const passwordForm = useFormValidation<PasswordForm>({
    initialValues: { password: '', confirmPassword: '' },
    validators: {
      password: (value) => validatePassword(value),
      confirmPassword: (value, form) => validateConfirmPassword(form.password, value),
    },
    relatedFields: {
      password: ['confirmPassword'],
    },
  })

  useEffect(() => {
    if (!email || !otp) {
      navigate('/forgot-password', { replace: true })
    }
  }, [email, otp, navigate])

  const handleReset = async (e: FormEvent) => {
    e.preventDefault()
    if (!passwordForm.validateAll()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await authService.resetPassword({
        email,
        otp,
        password: passwordForm.values.password,
        confirmPassword: passwordForm.values.confirmPassword,
      })
      navigate('/login', {
        state: { message: 'Password reset successful. Please sign in with your new password.' },
      })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Password reset failed'))
    } finally {
      setLoading(false)
    }
  }

  if (!email || !otp) {
    return null
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Create a strong new password"
      step={{ current: 3, total: 3 }}
      footer={
        <p className="text-center text-sm text-gray-600">
          <AuthLink to="/login">Back to login</AuthLink>
        </p>
      }
    >
      {info && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{info}</p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <form onSubmit={handleReset} className="space-y-4" noValidate>
        <PasswordField
          name="password"
          label="New password"
          placeholder="Min 8 chars, upper, lower, number, symbol"
          autoComplete="new-password"
          value={passwordForm.values.password}
          error={passwordForm.getFieldError('password')}
          onChange={passwordForm.handleChange}
          onBlur={passwordForm.handleBlur}
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          value={passwordForm.values.confirmPassword}
          error={passwordForm.getFieldError('confirmPassword')}
          onChange={passwordForm.handleChange}
          onBlur={passwordForm.handleBlur}
        />
        <button
          type="submit"
          disabled={loading || !passwordForm.isFormValid}
          className={primaryBtnClass}
        >
          {loading ? 'Resetting...' : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword
