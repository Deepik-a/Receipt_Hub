import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.post('/auth/register', [AuthController, 'register'])
    router.post('/auth/login', [AuthController, 'login'])
    router.post('/auth/forgot-password', [AuthController, 'forgotPassword'])
    router.post('/auth/verify-otp', [AuthController, 'verifyOtp'])
    router.post('/auth/reset-password', [AuthController, 'resetPassword'])

    router.get('/auth/google', [AuthController, 'googleRedirect'])
    router.get('/auth/google/callback', [AuthController, 'googleCallback'])

    router
      .group(() => {
        router.get('/auth/me', [AuthController, 'me'])
        router.post('/auth/logout', [AuthController, 'logout'])
      })
      .use(middleware.auth())
  })
  .prefix('/api')
