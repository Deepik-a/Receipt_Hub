import logger from '@adonisjs/core/services/logger'
import env from '#start/env'
import type { ApplicationService } from '@adonisjs/core/types'

function isSmtpConfigured(): boolean {
  const host = env.get('SMTP_HOST')?.trim()
  const user = env.get('SMTP_USER')?.trim()
  const pass = env.get('SMTP_PASSWORD')?.trim()
  return Boolean(host && user && pass)
}

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

    const { AuthService } = await import('#interfaces/auth_service')
    this.app.container.bind(AuthService, async (resolver) => {
      const { default: AuthServiceImpl } = await import('#services/auth_service')
      return resolver.make(AuthServiceImpl)
    })

    const { OtpService } = await import('#interfaces/otp_service')
    this.app.container.bind(OtpService, async (resolver) => {
      const { default: OtpServiceImpl } = await import('#services/otp_service')
      return resolver.make(OtpServiceImpl)
    })

    const { MailService } = await import('#interfaces/mail_service')
    this.app.container.bind(MailService, async (resolver) => {
      const { default: MailServiceImpl } = await import('#services/mail_service')
      return resolver.make(MailServiceImpl)
    })

    const { PendingRegistrationService } = await import('#interfaces/pending_registration_service')
    this.app.container.bind(PendingRegistrationService, async (resolver) => {
      const { default: PendingRegistrationServiceImpl } = await import('#services/pending_registration_service')
      return resolver.make(PendingRegistrationServiceImpl)
    })

    const { PreferenceService } = await import('#interfaces/preference_service')
    this.app.container.bind(PreferenceService, async (resolver) => {
      const { default: PreferenceServiceImpl } = await import('#services/preference_service')
      return resolver.make(PreferenceServiceImpl)
    })

    const { RecipeService } = await import('#interfaces/recipe_service')
    this.app.container.bind(RecipeService, async (resolver) => {
      const { default: RecipeServiceImpl } = await import('#services/recipe_service')
      return resolver.make(RecipeServiceImpl)
    })

    const { SpoonacularService } = await import('#interfaces/spoonacular_service')
    this.app.container.bind(SpoonacularService, async (resolver) => {
      const { default: SpoonacularServiceImpl } = await import('#services/spoonacular_service')
      return resolver.make(SpoonacularServiceImpl)
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
  public async ready() {
    const host = env.get('HOST')
    const port = env.get('PORT')
    const appUrl = env.get('APP_URL')
    logger.info(`[Server] API running at ${appUrl} (${host}:${port})`)

    if (isSmtpConfigured()) {
      logger.info('[Mail] SMTP configured — OTP emails will be sent')
    } else {
      logger.warn(
        '[Mail] SMTP not configured — OTP codes will only appear in this console (development). ' +
          'Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in backend/.env, then restart the server.'
      )
    }
  }

  /**
   * Preparation for shutdown
   */
  public async shutdown() {}
}
