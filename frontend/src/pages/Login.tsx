import { useState, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '@/components/AuthLayout'
import { inputClass, primaryBtnClass, secondaryBtnClass } from '@/components/authFormStyles'
import authService from '@/services/authService'
import useAuthStore from '@/store/authStore'
import { getApiErrorMessage } from '@/utils/apiError'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth, isAuthenticated } = useAuthStore()

  const successMessage = (location.state as { message?: string } | null)?.message

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await authService.login(form)
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {successMessage}
          </p>
        )}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          minLength={8}
          value={form.password}
          onChange={handleChange}
          className={inputClass}
        />
        <p className="text-right">
          <AuthLink to="/forgot-password">Forgot password?</AuthLink>
        </p>
        <button type="submit" disabled={loading} className={primaryBtnClass}>
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
