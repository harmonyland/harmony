export type RequestMethods =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'head'
  | 'delete'

export enum HttpResponseCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  NotModified = 304,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  TooManyRequests = 429,
  GatewayUnavailable = 502
}

export interface RequestHeaders {
  [name: string]: string
}

export interface DiscordAPIErrorPayload {
  url: string
  status: number
  method: string
  code?: number
  message?: string
  errors: object
  // any for backward compatiblity
  requestData: Record<string, any>
}

export const METHODS = ['get', 'post', 'patch', 'put', 'delete', 'head']
