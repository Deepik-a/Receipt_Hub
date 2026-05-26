export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    VERIFY_REGISTRATION: '/auth/verify-registration',
    RESEND_OTP: '/auth/resend-otp',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  RECIPES: {
    SEARCH: '/recipes/search',
    SHOW: '/recipes/:id',
    FAVORITES: '/recipes/favorites',
    FAVORITES_IDS: '/recipes/favorites/ids',
    FAVORITES_TOGGLE: '/recipes/favorites/toggle',
  },
  USER: {
    PREFERENCES: '/user/preferences',
    AVATAR: '/user/avatar',
    CHANGE_PASSWORD: '/user/change-password',
  },
  UPLOADS: {
    AVATARS: '/uploads/avatars/:filename',
  },
}
