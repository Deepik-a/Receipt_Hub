import type User from '#models/user'

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: number): Promise<User | null>
  abstract findByGoogleId(googleId: string): Promise<User | null>
  abstract create(data: {
    fullName: string
    email: string
    password: string
    provider?: 'email' | 'google'
  }): Promise<User>
  abstract createFromGoogle(data: {
    fullName: string
    email: string
    googleId: string
    avatarUrl: string | null
  }): Promise<User>
  abstract linkGoogleAccount(
    user: User,
    data: { googleId: string; avatarUrl: string | null }
  ): Promise<User>
  abstract updatePassword(user: User, password: string): Promise<User>
}
