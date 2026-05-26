import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthLink } from '@/components/AuthLayout'
import FormField from '@/components/FormField'
import { primaryBtnClass, secondaryBtnClass } from '@/components/authFormStyles'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useOtpCooldown } from '@/hooks/useOtpCooldown'
import authService from '@/services/authService'
import useAuthStore from '@/store/authStore'
import { getApiErrorMessage } from '@/utils/apiError'
import { validateOtp } from '@/utils/authValidation'
import { clearOtpCooldown, formatCooldown } from '@/utils/otpCooldown'
import type { OtpPurpose } from '@/types/user'

type OtpForm = {
  otp: string
}

type VerifyLocationState = {
  email?: string
  purpose?: OtpPurpose
  message?: string
}

const VerifyOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const routeState = (location.state as VerifyLocationState | null) ?? {}
  const email = routeState.email ?? ''
  const purpose: OtpPurpose = routeState.purpose ?? 'register'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(routeState.message ?? null)
  const { setAuth } = useAuthStore()

  const { secondsLeft, canVerify, canResend, restart, ensureStarted } = useOtpCooldown(
    email,
    purpose
  )

  const { values, handleChange, handleBlur, validateAll, getFieldError, isFormValid } =
    useFormValidation<OtpForm>({
      initialValues: { otp: '' },
      validators: {
        otp: (value) => validateOtp(value),
      },
    })

  useEffect(() => {
    if (!email) {
      navigate(purpose === 'register' ? '/register' : '/forgot-password', { replace: true })
      return
    }
    ensureStarted()
  }, [email, navigate, purpose, ensureStarted])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!canVerify) {
      setError('This code has expired. Use Resend code to get a new one.')
      return
    }

    if (!validateAll()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (purpose === 'register') {
        const data = await authService.verifyRegistration({ email, otp: values.otp })
        clearOtpCooldown(email, purpose)
        setAuth(data.token, data.user)
        navigate('/', { replace: true })
        return
      }

      await authService.verifyOtp({
        email,
        otp: values.otp,
        purpose: 'password_reset',
      })

      clearOtpCooldown(email, purpose)
      navigate('/reset-password', {
        state: { email, otp: values.otp, message: 'Code verified. Choose your new password.' },
        replace: true,
      })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Verification failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) {
      return
    }

    setLoading(true)
    setError(null)
    setInfo(null)

    try {
      const data = await authService.resendOtp({ email, purpose })
      restart()
      setInfo(data.message)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not resend code'))
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return null
  }

  const isRegister = purpose === 'register'

  return (
    <AuthLayout
      title={isRegister ? 'Verify your email' : 'Enter reset code'}
      subtitle={`We sent a 6-digit code to ${email}`}
      step={{ current: 2, total: isRegister ? 2 : 3 }}
      footer={
        <p className="text-center text-sm text-gray-600">
          {isRegister ? (
            <>
              Wrong email? <AuthLink to="/register">Sign up again</AuthLink>
            </>
          ) : (
            <AuthLink to="/login">Back to login</AuthLink>
          )}
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {info && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{info}</p>
        )}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <p className="text-xs text-gray-500">
          Check your inbox and spam folder for a Recipe Hub email with your 6-digit code.
        </p>
        {canVerify ? (
          <p className="text-xs text-amber-700">
            Code expires in {formatCooldown(secondsLeft)}. Enter it before the timer ends.
          </p>
        ) : (
          <p className="text-xs text-red-600">
            This code has expired. Tap Resend code to get a new one (1-minute wait applies).
          </p>
        )}
        <FormField
          name="otp"
          label="6-digit code"
          placeholder="6-digit code"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={values.otp}
          error={getFieldError('otp')}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <button
          type="submit"
          disabled={loading || !isFormValid || !canVerify}
          className={primaryBtnClass}
        >
          {loading ? 'Verifying...' : isRegister ? 'Verify and continue' : 'Verify code'}
        </button>
        <button
          type="button"
          disabled={loading || !canResend}
          onClick={handleResend}
          className={secondaryBtnClass}
        >
          {canResend ? 'Resend code' : `Resend code in ${formatCooldown(secondsLeft)}`}
        </button>
      </form>
    </AuthLayout>
  )
}

export default VerifyOtp
