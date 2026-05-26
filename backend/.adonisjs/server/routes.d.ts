import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.verify_registration': { paramsTuple?: []; params?: {} }
    'auth.resend_otp': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.verify_otp': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.google_redirect': { paramsTuple?: []; params?: {} }
    'auth.google_callback': { paramsTuple?: []; params?: {} }
    'favorites.get_ids': { paramsTuple?: []; params?: {} }
    'favorites.index': { paramsTuple?: []; params?: {} }
    'favorites.toggle': { paramsTuple?: []; params?: {} }
    'recipes.search': { paramsTuple?: []; params?: {} }
    'recipes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.serve_avatar': { paramsTuple: [ParamValue]; params: {'filename': ParamValue} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'preferences.show': { paramsTuple?: []; params?: {} }
    'preferences.update': { paramsTuple?: []; params?: {} }
    'profile.update_avatar': { paramsTuple?: []; params?: {} }
    'profile.change_password': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.verify_registration': { paramsTuple?: []; params?: {} }
    'auth.resend_otp': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.verify_otp': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'favorites.toggle': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'profile.update_avatar': { paramsTuple?: []; params?: {} }
    'profile.change_password': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.google_redirect': { paramsTuple?: []; params?: {} }
    'auth.google_callback': { paramsTuple?: []; params?: {} }
    'favorites.get_ids': { paramsTuple?: []; params?: {} }
    'favorites.index': { paramsTuple?: []; params?: {} }
    'recipes.search': { paramsTuple?: []; params?: {} }
    'recipes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.serve_avatar': { paramsTuple: [ParamValue]; params: {'filename': ParamValue} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'preferences.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.google_redirect': { paramsTuple?: []; params?: {} }
    'auth.google_callback': { paramsTuple?: []; params?: {} }
    'favorites.get_ids': { paramsTuple?: []; params?: {} }
    'favorites.index': { paramsTuple?: []; params?: {} }
    'recipes.search': { paramsTuple?: []; params?: {} }
    'recipes.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.serve_avatar': { paramsTuple: [ParamValue]; params: {'filename': ParamValue} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'preferences.show': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'preferences.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}