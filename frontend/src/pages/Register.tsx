import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '@/components/AuthLayout'
import FormField from '@/components/FormField'
import PasswordField from '@/components/PasswordField'
import { primaryBtnClass, secondaryBtnClass } from '@/components/authFormStyles'
import { useFormValidation } from '@/hooks/useFormValidation'
import authService from '@/services/authService'
import useAuthStore from '@/store/authStore'
import { getApiErrorMessage } from '@/utils/apiError'
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from '@/utils/authValidation'
import { startOtpCooldown } from '@/utils/otpCooldown'

type RegisterForm = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const { values, handleChange, handleBlur, validateAll, getFieldError, isFormValid } =
    useFormValidation<RegisterForm>({
      initialValues: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      validators: {
        fullName: (value) => validateFullName(value),
        email: (value) => validateEmail(value),
        password: (value) => validatePassword(value),
        confirmPassword: (value, form) => validateConfirmPassword(form.password, value),
      },
      relatedFields: {
        password: ['confirmPassword'],
      },
    })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateAll()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await authService.register(values)
      startOtpCooldown(data.email, 'register')
      navigate('/verify-otp', {
        state: {
          email: data.email,
          purpose: 'register',
          message: data.message,
        },
      })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    window.location.href = authService.googleLoginUrl()
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Recipe Hub — it only takes a minute"
      step={{ current: 1, total: 2 }}
      footer={
        <p className="text-center text-sm text-gray-600">
          Already have an account? <AuthLink to="/login">Sign in</AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <FormField
          name="fullName"
          label="Full name"
          autoComplete="name"
          value={values.fullName}
          error={getFieldError('fullName')}
          onChange={handleChange}
          onBlur={handleBlur}
        />
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
        <PasswordField
          name="password"
          label="Password"
          placeholder="Min 8 chars, upper, lower, number, symbol"
          autoComplete="new-password"
          value={values.password}
          error={getFieldError('password')}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          value={values.confirmPassword}
          error={getFieldError('confirmPassword')}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <button type="submit" disabled={loading || !isFormValid} className={primaryBtnClass}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
        <button type="button" onClick={handleGoogleSignup} className={secondaryBtnClass}>
          Continue with Google
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register
