import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import authService from '@/services/authService'
import useAuthStore from '@/store/authStore'

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
