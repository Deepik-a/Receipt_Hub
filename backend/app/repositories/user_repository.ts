import User from '#models/user'
import { UserRepository } from '#interfaces/user_repository'

export default class UserRepositoryImpl extends UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findBy('email', email)
  }

  async findById(id: number): Promise<User | null> {
    return User.find(id)
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return User.findBy('googleId', googleId)
  }

  async create(data: {
    fullName: string
    email: string
    password: string
    provider?: 'email' | 'google'
  }): Promise<User> {
    return User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      provider: data.provider ?? 'email',
    })
  }

  async createFromGoogle(data: {
    fullName: string
    email: string
    googleId: string
    avatarUrl: string | null
  }): Promise<User> {
    return User.create({
      fullName: data.fullName,
      email: data.email,
      googleId: data.googleId,
      avatarUrl: data.avatarUrl,
      provider: 'google',
      password: null,
    })
  }

  async linkGoogleAccount(
    user: User,
    data: { googleId: string; avatarUrl: string | null }
  ): Promise<User> {
    user.googleId = data.googleId
    user.avatarUrl = data.avatarUrl
    user.provider = 'google'
    await user.save()
    return user
  }

  async updatePassword(user: User, password: string): Promise<User> {
    user.password = password
    await user.save()
    return user
  }
}
