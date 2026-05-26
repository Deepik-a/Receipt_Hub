import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '@/components/AuthLayout'
import FormField from '@/components/FormField'
import { primaryBtnClass } from '@/components/authFormStyles'
import { useFormValidation } from '@/hooks/useFormValidation'
import authService from '@/services/authService'
import { getApiErrorMessage } from '@/utils/apiError'
import { validateEmail } from '@/utils/authValidation'
import { startOtpCooldown } from '@/utils/otpCooldown'

type ForgotPasswordForm = {
  email: string
}

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { values, handleChange, handleBlur, validateAll, getFieldError, isFormValid } =
    useFormValidation<ForgotPasswordForm>({
      initialValues: { email: '' },
      validators: {
        email: (value) => validateEmail(value),
      },
    })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateAll()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const email = values.email.trim()
      const data = await authService.forgotPassword({ email })
      startOtpCooldown(email, 'password_reset')
      navigate('/verify-otp', {
        state: {
          email,
          purpose: 'password_reset',
          message: data.message,
        },
      })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to send reset code'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send a 6-digit code"
      step={{ current: 1, total: 3 }}
      footer={
        <p className="text-center text-sm text-gray-600">
          Remember your password? <AuthLink to="/login">Sign in</AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <p className="text-xs text-gray-500">
          A reset code is only sent if an account exists for this email.
        </p>
        <FormField
          name="email"
          label="Email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          error={getFieldError('email')}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <button type="submit" disabled={loading || !isFormValid} className={primaryBtnClass}>
          {loading ? 'Sending...' : 'Send reset code'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
