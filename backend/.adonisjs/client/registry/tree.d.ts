/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    forgotPassword: typeof routes['auth.forgot_password']
    verifyOtp: typeof routes['auth.verify_otp']
    resetPassword: typeof routes['auth.reset_password']
    googleRedirect: typeof routes['auth.google_redirect']
    googleCallback: typeof routes['auth.google_callback']
    me: typeof routes['auth.me']
    logout: typeof routes['auth.logout']
  }
}
