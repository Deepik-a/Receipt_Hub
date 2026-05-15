import type { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  public async register() {
    const { UserRepository } = await import('#interfaces/user_repository')
    this.app.container.bind(UserRepository, async (resolver) => {
      const { default: UserRepositoryImpl } = await import('#repositories/user_repository')
      return resolver.make(UserRepositoryImpl)
    })
  }

  /**
   * The container bindings have booted
   */
  public async boot() {}

  /**
   * The application has been booted
   */
  public async start() {}

  /**
   * The process has been started
   */
  public async ready() {}

  /**
   * Preparation for shutdown
   */
  public async shutdown() {}
}
