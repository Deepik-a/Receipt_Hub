import type { OtpPurpose } from '@/types/user'

export const OTP_VALIDITY_SECONDS = 60

function storageKey(email: string, purpose: OtpPurpose): string {
  return `otpExpiresAt:${purpose}:${email.trim().toLowerCase()}`
}

/** Start (or restart) the 1-minute OTP validation window. */
export function startOtpCooldown(email: string, purpose: OtpPurpose): void {
  const expiresAt = Date.now() + OTP_VALIDITY_SECONDS * 1000
  localStorage.setItem(storageKey(email, purpose), String(expiresAt))
}

export function getOtpCooldownRemaining(email: string, purpose: OtpPurpose): number {
  const raw = localStorage.getItem(storageKey(email, purpose))
  if (!raw) {
    return 0
  }

  const expiresAt = Number(raw)
  if (Number.isNaN(expiresAt)) {
    return 0
  }

  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
}

export function clearOtpCooldown(email: string, purpose: OtpPurpose): void {
  localStorage.removeItem(storageKey(email, purpose))
}

export function formatCooldown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
