import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import authService from '@/services/authService'
import useAuthStore from '@/store/authStore'
import type { AuthUser } from '@/types/user'

/** Decode base64url (RFC 4648) to UTF-8 string */
function decodeBase64UrlToUtf8(value: string): string {
  const pad = value.length % 4 === 0 ? '' : '='.repeat(4 - (value.length % 4))
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + pad
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

function parseUserFromCallback(searchParams: URLSearchParams): AuthUser | null {
  const profile = searchParams.get('profile')
  if (profile) {
    try {
      return JSON.parse(decodeBase64UrlToUtf8(profile)) as AuthUser
    } catch {
      return null
    }
  }

  const legacyUser = searchParams.get('user')
  if (legacyUser) {
    try {
      return JSON.parse(legacyUser) as AuthUser
    } catch {
      return null
    }
  }

  return null
}

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')
    const authError = searchParams.get('error')

    if (authError) {
      setError('Google sign-in failed. Please try again.')
      return
    }

    if (!token) {
      setError('Missing authentication token.')
      return
    }

    localStorage.setItem('token', token)

    const userFromUrl = parseUserFromCallback(searchParams)
    if (userFromUrl) {
      setAuth(token, userFromUrl)
      navigate('/', { replace: true })
      return
    }

    authService
      .me()
      .then(({ user }) => {
        setAuth(token, user)
        navigate('/', { replace: true })
      })
      .catch(() => {
        setError('Could not load your profile after sign-in.')
      })
  }, [navigate, searchParams, setAuth])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-600">{error}</p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p className="text-gray-600">Completing sign-in...</p>
    </div>
  )
}

export default AuthCallback
