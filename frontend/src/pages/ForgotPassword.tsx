import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '@/components/AuthLayout'
import { inputClass, primaryBtnClass } from '@/components/authFormStyles'
import authService from '@/services/authService'
import { getApiErrorMessage } from '@/utils/apiError'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await authService.forgotPassword({ email })
      navigate('/reset-password', {
        state: { email, message: data.message },
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
      step={{ current: 1, total: 2 }}
      footer={
        <p className="text-center text-sm text-gray-600">
          Remember your password? <AuthLink to="/login">Sign in</AuthLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <p className="text-xs text-gray-500">
          In development, the code is printed in the backend server console.
        </p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          autoComplete="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className={inputClass}
        />
        <button type="submit" disabled={loading} className={primaryBtnClass}>
          {loading ? 'Sending...' : 'Send reset code'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
