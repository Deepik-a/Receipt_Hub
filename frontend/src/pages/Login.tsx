import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '@/components/AuthLayout'
import FormField from '@/components/FormField'
import PasswordField from '@/components/PasswordField'
import { primaryBtnClass, secondaryBtnClass } from '@/components/authFormStyles'
import { useFormValidation } from '@/hooks/useFormValidation'
import authService from '@/services/authService'
import useAuthStore from '@/store/authStore'
import { getApiErrorMessage } from '@/utils/apiError'
import { validateEmail, validatePasswordForLogin } from '@/utils/authValidation'

type LoginForm = {
  email: string
  password: string
}

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth, isAuthenticated } = useAuthStore()

  const { values, handleChange, handleBlur, validateAll, getFieldError, isFormValid } =
    useFormValidation<LoginForm>({
      initialValues: { email: '', password: '' },
      validators: {
        email: (value) => validateEmail(value),
        password: (value) => validatePasswordForLogin(value),
      },
    })

  const successMessage = (location.state as { message?: string } | null)?.message

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
      const data = await authService.login(values)
      setAuth(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = authService.googleLoginUrl()
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to save recipes and preferences"
      footer={
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account? <AuthLink to="/register">Create one</AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {successMessage && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {successMessage}
          </p>
        )}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
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
          placeholder="Password"
          autoComplete="current-password"
          value={values.password}
          error={getFieldError('password')}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p className="text-right">
          <AuthLink to="/forgot-password">Forgot password?</AuthLink>
        </p>
        <button type="submit" disabled={loading || !isFormValid} className={primaryBtnClass}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button type="button" onClick={handleGoogleLogin} className={secondaryBtnClass}>
          Continue with Google
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
