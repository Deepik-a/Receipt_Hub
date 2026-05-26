import { useCallback, useEffect, useState } from 'react'
import {
  getOtpCooldownRemaining,
  OTP_VALIDITY_SECONDS,
  startOtpCooldown,
} from '@/utils/otpCooldown'
import type { OtpPurpose } from '@/types/user'

export function useOtpCooldown(email: string, purpose: OtpPurpose) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    email ? getOtpCooldownRemaining(email, purpose) : 0
  )

  useEffect(() => {
    if (!email) {
      return
    }

    const tick = () => setSecondsLeft(getOtpCooldownRemaining(email, purpose))
    tick()
    const intervalId = window.setInterval(tick, 1000)
    return () => window.clearInterval(intervalId)
  }, [email, purpose])

  const restart = useCallback(() => {
    if (!email) {
      return
    }
    startOtpCooldown(email, purpose)
    setSecondsLeft(OTP_VALIDITY_SECONDS)
  }, [email, purpose])

  const ensureStarted = useCallback(() => {
    if (!email) {
      return
    }

    const remaining = getOtpCooldownRemaining(email, purpose)
    if (remaining > 0) {
      setSecondsLeft(remaining)
      return
    }

    const key = `otpExpiresAt:${purpose}:${email.trim().toLowerCase()}`
    if (!localStorage.getItem(key)) {
      startOtpCooldown(email, purpose)
      setSecondsLeft(OTP_VALIDITY_SECONDS)
    }
  }, [email, purpose])

  return {
    secondsLeft,
    canVerify: secondsLeft > 0,
    canResend: secondsLeft === 0,
    restart,
    ensureStarted,
  }
}
