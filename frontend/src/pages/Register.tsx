import { useState, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '@/components/AuthLayout'
import { inputClass, primaryBtnClass, secondaryBtnClass } from '@/components/authFormStyles'
import authService from '@/services/authService'
import useAuthStore from '@/store/authStore'
import { getApiErrorMessage } from '@/utils/apiError'

const Register = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { setAuth, isAuthenticated } = useAuthStore()

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

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const data = await authService.register(form)
      setAuth(data.token, data.user)
      navigate('/')
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
      step={{ current: 1, total: 1 }}
      footer={
        <p className="text-center text-sm text-gray-600">
          Already have an account? <AuthLink to="/login">Sign in</AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <input
          type="text"
          name="fullName"
          placeholder="Full name"
          required
          autoComplete="name"
          value={form.fullName}
          onChange={handleChange}
          className={inputClass}
        />
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
          placeholder="Password (min 8 characters)"
          required
          minLength={8}
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
          minLength={8}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          className={inputClass}
        />
        <button type="submit" disabled={loading} className={primaryBtnClass}>
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
