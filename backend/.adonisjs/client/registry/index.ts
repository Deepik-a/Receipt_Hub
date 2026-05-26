/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.register': {
    methods: ["POST"],
    pattern: '/api/auth/register',
    tokens: [{"old":"/api/auth/register","type":0,"val":"api","end":""},{"old":"/api/auth/register","type":0,"val":"auth","end":""},{"old":"/api/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.verify_registration': {
    methods: ["POST"],
    pattern: '/api/auth/verify-registration',
    tokens: [{"old":"/api/auth/verify-registration","type":0,"val":"api","end":""},{"old":"/api/auth/verify-registration","type":0,"val":"auth","end":""},{"old":"/api/auth/verify-registration","type":0,"val":"verify-registration","end":""}],
    types: placeholder as Registry['auth.verify_registration']['types'],
  },
  'auth.resend_otp': {
    methods: ["POST"],
    pattern: '/api/auth/resend-otp',
    tokens: [{"old":"/api/auth/resend-otp","type":0,"val":"api","end":""},{"old":"/api/auth/resend-otp","type":0,"val":"auth","end":""},{"old":"/api/auth/resend-otp","type":0,"val":"resend-otp","end":""}],
    types: placeholder as Registry['auth.resend_otp']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/auth/login',
    tokens: [{"old":"/api/auth/login","type":0,"val":"api","end":""},{"old":"/api/auth/login","type":0,"val":"auth","end":""},{"old":"/api/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.forgot_password': {
    methods: ["POST"],
    pattern: '/api/auth/forgot-password',
    tokens: [{"old":"/api/auth/forgot-password","type":0,"val":"api","end":""},{"old":"/api/auth/forgot-password","type":0,"val":"auth","end":""},{"old":"/api/auth/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['auth.forgot_password']['types'],
  },
  'auth.verify_otp': {
    methods: ["POST"],
    pattern: '/api/auth/verify-otp',
    tokens: [{"old":"/api/auth/verify-otp","type":0,"val":"api","end":""},{"old":"/api/auth/verify-otp","type":0,"val":"auth","end":""},{"old":"/api/auth/verify-otp","type":0,"val":"verify-otp","end":""}],
    types: placeholder as Registry['auth.verify_otp']['types'],
  },
  'auth.reset_password': {
    methods: ["POST"],
    pattern: '/api/auth/reset-password',
    tokens: [{"old":"/api/auth/reset-password","type":0,"val":"api","end":""},{"old":"/api/auth/reset-password","type":0,"val":"auth","end":""},{"old":"/api/auth/reset-password","type":0,"val":"reset-password","end":""}],
    types: placeholder as Registry['auth.reset_password']['types'],
  },
  'auth.google_redirect': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/google',
    tokens: [{"old":"/api/auth/google","type":0,"val":"api","end":""},{"old":"/api/auth/google","type":0,"val":"auth","end":""},{"old":"/api/auth/google","type":0,"val":"google","end":""}],
    types: placeholder as Registry['auth.google_redirect']['types'],
  },
  'auth.google_callback': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/google/callback',
    tokens: [{"old":"/api/auth/google/callback","type":0,"val":"api","end":""},{"old":"/api/auth/google/callback","type":0,"val":"auth","end":""},{"old":"/api/auth/google/callback","type":0,"val":"google","end":""},{"old":"/api/auth/google/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['auth.google_callback']['types'],
  },
  'favorites.get_ids': {
    methods: ["GET","HEAD"],
    pattern: '/api/recipes/favorites/ids',
    tokens: [{"old":"/api/recipes/favorites/ids","type":0,"val":"api","end":""},{"old":"/api/recipes/favorites/ids","type":0,"val":"recipes","end":""},{"old":"/api/recipes/favorites/ids","type":0,"val":"favorites","end":""},{"old":"/api/recipes/favorites/ids","type":0,"val":"ids","end":""}],
    types: placeholder as Registry['favorites.get_ids']['types'],
  },
  'favorites.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/recipes/favorites',
    tokens: [{"old":"/api/recipes/favorites","type":0,"val":"api","end":""},{"old":"/api/recipes/favorites","type":0,"val":"recipes","end":""},{"old":"/api/recipes/favorites","type":0,"val":"favorites","end":""}],
    types: placeholder as Registry['favorites.index']['types'],
  },
  'favorites.toggle': {
    methods: ["POST"],
    pattern: '/api/recipes/favorites/toggle',
    tokens: [{"old":"/api/recipes/favorites/toggle","type":0,"val":"api","end":""},{"old":"/api/recipes/favorites/toggle","type":0,"val":"recipes","end":""},{"old":"/api/recipes/favorites/toggle","type":0,"val":"favorites","end":""},{"old":"/api/recipes/favorites/toggle","type":0,"val":"toggle","end":""}],
    types: placeholder as Registry['favorites.toggle']['types'],
  },
  'recipes.search': {
    methods: ["GET","HEAD"],
    pattern: '/api/recipes/search',
    tokens: [{"old":"/api/recipes/search","type":0,"val":"api","end":""},{"old":"/api/recipes/search","type":0,"val":"recipes","end":""},{"old":"/api/recipes/search","type":0,"val":"search","end":""}],
    types: placeholder as Registry['recipes.search']['types'],
  },
  'recipes.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/recipes/:id',
    tokens: [{"old":"/api/recipes/:id","type":0,"val":"api","end":""},{"old":"/api/recipes/:id","type":0,"val":"recipes","end":""},{"old":"/api/recipes/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['recipes.show']['types'],
  },
  'profile.serve_avatar': {
    methods: ["GET","HEAD"],
    pattern: '/api/uploads/avatars/:filename',
    tokens: [{"old":"/api/uploads/avatars/:filename","type":0,"val":"api","end":""},{"old":"/api/uploads/avatars/:filename","type":0,"val":"uploads","end":""},{"old":"/api/uploads/avatars/:filename","type":0,"val":"avatars","end":""},{"old":"/api/uploads/avatars/:filename","type":1,"val":"filename","end":""}],
    types: placeholder as Registry['profile.serve_avatar']['types'],
  },
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/me',
    tokens: [{"old":"/api/auth/me","type":0,"val":"api","end":""},{"old":"/api/auth/me","type":0,"val":"auth","end":""},{"old":"/api/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['auth.me']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/auth/logout',
    tokens: [{"old":"/api/auth/logout","type":0,"val":"api","end":""},{"old":"/api/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'preferences.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/user/preferences',
    tokens: [{"old":"/api/user/preferences","type":0,"val":"api","end":""},{"old":"/api/user/preferences","type":0,"val":"user","end":""},{"old":"/api/user/preferences","type":0,"val":"preferences","end":""}],
    types: placeholder as Registry['preferences.show']['types'],
  },
  'preferences.update': {
    methods: ["PUT"],
    pattern: '/api/user/preferences',
    tokens: [{"old":"/api/user/preferences","type":0,"val":"api","end":""},{"old":"/api/user/preferences","type":0,"val":"user","end":""},{"old":"/api/user/preferences","type":0,"val":"preferences","end":""}],
    types: placeholder as Registry['preferences.update']['types'],
  },
  'profile.update_avatar': {
    methods: ["POST"],
    pattern: '/api/user/avatar',
    tokens: [{"old":"/api/user/avatar","type":0,"val":"api","end":""},{"old":"/api/user/avatar","type":0,"val":"user","end":""},{"old":"/api/user/avatar","type":0,"val":"avatar","end":""}],
    types: placeholder as Registry['profile.update_avatar']['types'],
  },
  'profile.change_password': {
    methods: ["POST"],
    pattern: '/api/user/change-password',
    tokens: [{"old":"/api/user/change-password","type":0,"val":"api","end":""},{"old":"/api/user/change-password","type":0,"val":"user","end":""},{"old":"/api/user/change-password","type":0,"val":"change-password","end":""}],
    types: placeholder as Registry['profile.change_password']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
