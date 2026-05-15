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
