import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.verify_otp': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.google_redirect': { paramsTuple?: []; params?: {} }
    'auth.google_callback': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.verify_otp': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.google_redirect': { paramsTuple?: []; params?: {} }
    'auth.google_callback': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.google_redirect': { paramsTuple?: []; params?: {} }
    'auth.google_callback': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}