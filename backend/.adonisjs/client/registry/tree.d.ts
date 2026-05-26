/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    verifyRegistration: typeof routes['auth.verify_registration']
    resendOtp: typeof routes['auth.resend_otp']
    login: typeof routes['auth.login']
    forgotPassword: typeof routes['auth.forgot_password']
    verifyOtp: typeof routes['auth.verify_otp']
    resetPassword: typeof routes['auth.reset_password']
    googleRedirect: typeof routes['auth.google_redirect']
    googleCallback: typeof routes['auth.google_callback']
    me: typeof routes['auth.me']
    logout: typeof routes['auth.logout']
  }
  favorites: {
    getIds: typeof routes['favorites.get_ids']
    index: typeof routes['favorites.index']
    toggle: typeof routes['favorites.toggle']
  }
  recipes: {
    search: typeof routes['recipes.search']
    show: typeof routes['recipes.show']
  }
  profile: {
    serveAvatar: typeof routes['profile.serve_avatar']
    updateAvatar: typeof routes['profile.update_avatar']
    changePassword: typeof routes['profile.change_password']
  }
  preferences: {
    show: typeof routes['preferences.show']
    update: typeof routes['preferences.update']
  }
}
