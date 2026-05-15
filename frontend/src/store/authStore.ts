import { create } from 'zustand'
import type { AuthUser } from '@/types/user'

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AuthUser) => void
  setUser: (user: AuthUser) => void
  logout: () => void
}

const storedUser = localStorage.getItem('user')

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
  isAuthenticated: !!localStorage.getItem('token'),

  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))

export default useAuthStore
