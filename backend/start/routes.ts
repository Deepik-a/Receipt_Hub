import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { API_ROUTES } from '#constants/routes'

const AuthController = () => import('#controllers/auth_controller')
const RecipesController = () => import('#controllers/recipes_controller')
const PreferencesController = () => import('#controllers/preferences_controller')
const FavoritesController = () => import('#controllers/favorites_controller')
const ProfileController = () => import('#controllers/profile_controller')

router
  .group(() => {
    router.post(API_ROUTES.AUTH.REGISTER, [AuthController, 'register'])
    router.post(API_ROUTES.AUTH.VERIFY_REGISTRATION, [AuthController, 'verifyRegistration'])
    router.post(API_ROUTES.AUTH.RESEND_OTP, [AuthController, 'resendOtp'])
    router.post(API_ROUTES.AUTH.LOGIN, [AuthController, 'login'])
    router.post(API_ROUTES.AUTH.FORGOT_PASSWORD, [AuthController, 'forgotPassword'])
    router.post(API_ROUTES.AUTH.VERIFY_OTP, [AuthController, 'verifyOtp'])
    router.post(API_ROUTES.AUTH.RESET_PASSWORD, [AuthController, 'resetPassword'])

    router.get(API_ROUTES.AUTH.GOOGLE, [AuthController, 'googleRedirect'])
    router.get(API_ROUTES.AUTH.GOOGLE_CALLBACK, [AuthController, 'googleCallback'])

    // Define specific favorites routes before the generic :id parameter route
    router.get(API_ROUTES.RECIPES.FAVORITES_IDS, [FavoritesController, 'getIds']).use(middleware.auth())
    router.get(API_ROUTES.RECIPES.FAVORITES, [FavoritesController, 'index']).use(middleware.auth())
    router.post(API_ROUTES.RECIPES.FAVORITES_TOGGLE, [FavoritesController, 'toggle']).use(middleware.auth())

    router.get(API_ROUTES.RECIPES.SEARCH, [RecipesController, 'search'])
    router.get(API_ROUTES.RECIPES.SHOW, [RecipesController, 'show'])

    // Public route to serve uploaded avatar files
    router.get(API_ROUTES.UPLOADS.AVATARS, [ProfileController, 'serveAvatar'])

    router
      .group(() => {
        router.get(API_ROUTES.AUTH.ME, [AuthController, 'me'])
        router.post(API_ROUTES.AUTH.LOGOUT, [AuthController, 'logout'])

        router.get(API_ROUTES.USER.PREFERENCES, [PreferencesController, 'show'])
        router.put(API_ROUTES.USER.PREFERENCES, [PreferencesController, 'update'])

        // User profile settings
        router.post(API_ROUTES.USER.AVATAR, [ProfileController, 'updateAvatar'])
        router.post(API_ROUTES.USER.CHANGE_PASSWORD, [ProfileController, 'changePassword'])
      })
      .use(middleware.auth())
  })
  .prefix('/api')
