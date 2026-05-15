import { useState, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '@/components/AuthLayout'
import { inputClass, primaryBtnClass, secondaryBtnClass } from '@/components/authFormStyles'
import authService from '@/services/authService'
import { getApiErrorMessage } from '@/utils/apiError'

type ResetLocationState = {
  email?: string
  message?: string
}

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = (location.state as ResetLocationState | null) ?? {}

  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({
    email: routeState.email ?? '',
    otp: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(routeState.message ?? null)

  useEffect(() => {
    if (!form.email) {
      navigate('/forgot-password', { replace: true })
    }
  }, [form.email, navigate])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await authService.verifyOtp({ email: form.email, otp: form.otp })
      setStep(2)
      setInfo('Code verified. Choose your new password.')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid or expired code'))
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    setError(null)
    setInfo(null)

    try {
      const data = await authService.forgotPassword({ email: form.email })
      setInfo(data.message)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not resend code'))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      await authService.resetPassword({
        email: form.email,
        otp: form.otp,
        password: form.password,
        confirmPassword: form.confirmPassword,
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

  if (!form.email) {
    return null
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle={
        step === 1
          ? `Enter the 6-digit code sent to ${form.email}`
          : 'Create a strong new password'
      }
      step={{ current: step, total: 2 }}
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

      {step === 1 ? (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input type="hidden" name="email" value={form.email} />
          <input
            type="text"
            name="otp"
            placeholder="6-digit code"
            required
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]{6}"
            autoComplete="one-time-code"
            value={form.otp}
            onChange={handleChange}
            className={inputClass}
          />
          <button type="submit" disabled={loading} className={primaryBtnClass}>
            {loading ? 'Verifying...' : 'Verify code'}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleResendCode}
            className={secondaryBtnClass}
          >
            Resend code
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="New password"
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
            placeholder="Confirm new password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={inputClass}
          />
          <button type="submit" disabled={loading} className={primaryBtnClass}>
            {loading ? 'Resetting...' : 'Update password'}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setStep(1)}
            className={secondaryBtnClass}
          >
            Back to code entry
          </button>
        </form>
      )}
    </AuthLayout>
  )
}

export default ResetPassword
