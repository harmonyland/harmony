import { Embed } from '../structures/embed.ts'
import { MessageAttachment } from '../structures/message.ts'
import { Collection } from '../utils/collection.ts'
import { Client } from '../client/mod.ts'
import { simplifyAPIError } from '../utils/err_fmt.ts'
import {
  DiscordAPIErrorPayload,
  HttpResponseCode,
  RequestHeaders,
  RequestMethods,
  METHODS
} from './types.ts'
import { Constants } from '../types/constants.ts'

export class DiscordAPIError extends Error {
  name = 'DiscordAPIError'
  error?: DiscordAPIErrorPayload

  constructor(error: string | DiscordAPIErrorPayload) {
    super()
    const fmt = Object.entries(
      typeof error === 'object' ? simplifyAPIError(error.errors) : {}
    )
    this.message =
      typeof error === 'string'
        ? `${error} `
        : `\n${error.method} ${error.url.slice(7)} returned ${error.status}\n(${
            error.code ?? 'unknown'
          }) ${error.message}${
            fmt.length === 0
              ? ''
              : `\n${fmt
                  .map(
                    (e) =>
                      `  at ${e[0]}:\n${e[1]
                        .map((e) => `   - ${e}`)
                        .join('\n')}`
                  )
                  .join('\n')}\n`
          }`
    if (typeof error === 'object') this.error = error
  }
}

export interface QueuedItem {
  bucket?: string | null
  url: string
  onComplete: () => Promise<
    | {
        rateLimited: any
        bucket?: string | null
        before: boolean
      }
    | undefined
  >
}

export interface RateLimit {
  url: string
  resetAt: number
  bucket: string | null
}

export type MethodFunction = (
  body?: unknown,
  maxRetries?: number,
  bucket?: string | null,
  rawResponse?: boolean
) => Promise<any>

export interface APIMap extends MethodFunction {
  /** Make a GET request to current route */
  get: APIMap
  /** Make a POST request to current route */
  post: APIMap
  /** Make a PATCH request to current route */
  patch: APIMap
  /** Make a PUT request to current route */
  put: APIMap
  /** Make a DELETE request to current route */
  delete: APIMap
  /** Make a HEAD request to current route */
  head: APIMap
  /** Continue building API Route */
  [name: string]: APIMap
}

/** API Route builder function */
export const builder = (rest: RESTManager, acum = '/'): APIMap => {
  const routes = {}
  const proxy = new Proxy(routes, {
    get: (_, p, __) => {
      if (p === 'toString') return () => acum
      if (METHODS.includes(String(p)) === true) {
        const method = ((rest as unknown) as {
          [name: string]: MethodFunction
        })[String(p)]
        return async (...args: any[]) =>
          await method.bind(rest)(
            `${Constants.DISCORD_API_URL}/v${rest.version}${acum.substring(
              0,
              acum.length - 1
            )}`,
            ...args
          )
      }
      return builder(rest, acum + String(p) + '/')
    }
  })
  return (proxy as unknown) as APIMap
}

export interface RESTOptions {
  /** Token to use for authorization */
  token?: string | (() => string | undefined)
  /** Headers to patch with if any */
  headers?: { [name: string]: string | undefined }
  /** Whether to use Canary instance of Discord API or not */
  canary?: boolean
  /** Discord REST API version to use */
  version?: 6 | 7 | 8
  /** Token Type to use for Authorization */
  tokenType?: TokenType
  /** User Agent to use (Header) */
  userAgent?: string
  /** Optional Harmony client */
  client?: Client
}

/** Token Type for REST API. */
export enum TokenType {
  /** Token type for Bot User */
  Bot = 'Bot',
  /** Token Type for OAuth2 */
  Bearer = 'Bearer',
  /** No Token Type. Can be used for User accounts. */
  None = ''
}

/** An easier to use interface for interacting with Discord REST API. */
export class RESTManager {
  queues: { [key: string]: QueuedItem[] } = {}
  rateLimits = new Collection<string, RateLimit>()
  /** Whether we are globally ratelimited or not */
  globalRateLimit: boolean = false
  /** Whether requests are being processed or not */
  processing: boolean = false
  /** API Version being used by REST Manager */
  version: number = 8
  /**
   * API Map - easy to use way for interacting with Discord API.
   *
   * Examples:
   * * ```ts
   *   rest.api.users['123'].get().then(userPayload => doSomething)
   *   ```
   * * ```ts
   *   rest.api.guilds['123'].channels.post({ name: 'my-channel', type: 0 }).then(channelPayload => {})
   *   ```
   */
  api: APIMap
  /** Token being used for Authorization */
  token?: string | (() => string | undefined)
  /** Token Type of the Token if any */
  tokenType: TokenType = TokenType.Bot
  /** Headers object which patch the current ones */
  headers: any = {}
  /** Optional custom User Agent (header) */
  userAgent?: string
  /** Whether REST Manager is using Canary API */
  canary?: boolean
  /** Optional Harmony Client object */
  client?: Client

  constructor(options?: RESTOptions) {
    this.api = builder(this)
    if (options?.token !== undefined) this.token = options.token
    if (options?.version !== undefined) this.version = options.version
    if (options?.headers !== undefined) this.headers = options.headers
    if (options?.tokenType !== undefined) this.tokenType = options.tokenType
    if (options?.userAgent !== undefined) this.userAgent = options.userAgent
    if (options?.canary !== undefined) this.canary = options.canary
    if (options?.client !== undefined) this.client = options.client
    this.handleRateLimits()
  }

  /** Checks the queues of buckets, if empty, delete entry */
  private checkQueues(): void {
    Object.entries(this.queues).forEach(([key, value]) => {
      if (value.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.queues[key]
      }
    })
  }

  /** Adds a Request to Queue */
  private queue(request: QueuedItem): void {
    const route = request.url.substring(
      Number(Constants.DISCORD_API_URL.length) + 1
    )
    const parts = route.split('/')
    parts.shift()
    const [id] = parts

    if (this.queues[id] !== undefined) {
      this.queues[id].push(request)
    } else {
      this.queues[id] = [request]
    }
  }

  private async processQueue(): Promise<void> {
    if (Object.keys(this.queues).length !== 0 && !this.globalRateLimit) {
      await Promise.allSettled(
        Object.values(this.queues).map(async (pathQueue) => {
          const request = pathQueue.shift()
          if (request === undefined) return

          const rateLimitedURLResetIn = await this.isRateLimited(request.url)

          if (typeof request.bucket === 'string') {
            const rateLimitResetIn = await this.isRateLimited(request.bucket)
            if (rateLimitResetIn !== false) {
              this.queue(request)
            } else {
              const result = await request.onComplete()
              if (result?.rateLimited !== undefined) {
                this.queue({
                  ...request,
                  bucket: result.bucket ?? request.bucket
                })
              }
            }
          } else {
            if (rateLimitedURLResetIn !== false) {
              this.queue(request)
            } else {
              const result = await request.onComplete()
              if (result?.rateLimited !== undefined) {
                this.queue({
                  ...request,
                  bucket: result.bucket ?? request.bucket
                })
              }
            }
          }
        })
      )
    }

    if (Object.keys(this.queues).length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.processQueue()
      this.checkQueues()
    } else this.processing = false
  }

  private prepare(body: any, method: RequestMethods): { [key: string]: any } {
    const headers: RequestHeaders = {
      'User-Agent':
        this.userAgent ??
        `DiscordBot (harmony, https://github.com/harmonyland/harmony)`
    }

    if (this.token !== undefined) {
      const token = typeof this.token === 'string' ? this.token : this.token()
      if (token !== undefined)
        headers.Authorization = `${this.tokenType} ${token}`.trim()
    }

    if (method === 'get' || method === 'head' || method === 'delete')
      body = undefined

    if (body?.reason !== undefined) {
      headers['X-Audit-Log-Reason'] = encodeURIComponent(body.reason)
    }

    let _files: undefined | MessageAttachment[]
    if (body?.embed?.files !== undefined && Array.isArray(body?.embed?.files)) {
      _files = body?.embed?.files
    }
    if (body?.embeds !== undefined && Array.isArray(body?.embeds)) {
      const files1 = body?.embeds
        .map((e: Embed) => e.files)
        .filter((e: MessageAttachment[]) => e !== undefined)
      for (const files of files1) {
        for (const file of files) {
          if (_files === undefined) _files = []
          _files?.push(file)
        }
      }
    }

    if (
      body?.file !== undefined ||
      body?.files !== undefined ||
      _files !== undefined
    ) {
      const files: Array<{ blob: Blob; name: string }> = []
      if (body?.file !== undefined) files.push(body.file)
      if (body?.files !== undefined && Array.isArray(body.files)) {
        for (const file of body.files) {
          files.push(file)
        }
      }
      if (_files !== undefined) {
        for (const file of _files) {
          files.push(file)
        }
      }
      const form = new FormData()
      files.forEach((file, index) =>
        form.append(`file${index + 1}`, file.blob, file.name)
      )
      const json = JSON.stringify(body)
      form.append('payload_json', json)
      if (body === undefined) body = {}
      body.file = form
    } else if (
      body !== undefined &&
      !['get', 'delete'].includes(method.toLowerCase())
    ) {
      headers['Content-Type'] = 'application/json'
    }

    if (this.headers !== undefined) Object.assign(headers, this.headers)
    const data: { [name: string]: any } = {
      headers,
      body: body?.file ?? JSON.stringify(body),
      method: method.toUpperCase()
    }

    return data
  }

  private isRateLimited(url: string): number | false {
    const global = this.rateLimits.get('global')
    const rateLimited = this.rateLimits.get(url)
    const now = Date.now()

    if (rateLimited !== undefined && now < rateLimited.resetAt) {
      return rateLimited.resetAt - now
    }
    if (global !== undefined && now < global.resetAt) {
      return global.resetAt - now
    }

    return false
  }

  /** Processes headers of the Response */
  private processHeaders(
    url: string,
    headers: Headers
  ): string | null | undefined {
    let rateLimited = false

    const global = headers.get('x-ratelimit-global')
    const bucket = headers.get('x-ratelimit-bucket')
    const remaining = headers.get('x-ratelimit-remaining')
    const resetAt = headers.get('x-ratelimit-reset')
    const retryAfter = headers.get('retry-after')

    if (remaining !== null && remaining === '0') {
      rateLimited = true

      this.rateLimits.set(url, {
        url,
        resetAt: Number(resetAt) * 1000,
        bucket
      })

      if (bucket !== null) {
        this.rateLimits.set(bucket, {
          url,
          resetAt: Number(resetAt) * 1000,
          bucket
        })
      }
    }

    if (global !== null) {
      const reset = Date.now() + Number(retryAfter)
      this.globalRateLimit = true
      rateLimited = true

      this.rateLimits.set('global', {
        url: 'global',
        resetAt: reset,
        bucket
      })

      if (bucket !== null) {
        this.rateLimits.set(bucket, {
          url: 'global',
          resetAt: reset,
          bucket
        })
      }
    }

    return rateLimited ? bucket : undefined
  }

  /** Handles status code of response and acts as required */
  private handleStatusCode(
    response: Response,
    body: any,
    data: { [key: string]: any },
    reject: CallableFunction
  ): void {
    const status = response.status

    // We have hit ratelimit - this should not happen
    if (status === HttpResponseCode.TooManyRequests) {
      if (this.client !== undefined)
        this.client.emit('rateLimit', {
          method: data.method,
          url: response.url,
          body
        })
      reject(new Error('RateLimited'))
      return
    }

    // It's a normal status code... just continue
    if (
      (status >= 200 && status < 400) ||
      status === HttpResponseCode.NoContent
    )
      return

    let text: undefined | string = Deno.inspect(
      body.errors === undefined ? body : body.errors
    )
    if (text === 'undefined') text = undefined

    if (status === HttpResponseCode.Unauthorized)
      reject(
        new DiscordAPIError(`Request was Unauthorized. Invalid Token.\n${text}`)
      )

    const _data = { ...data }
    if (_data?.headers !== undefined) delete _data.headers
    if (_data?.method !== undefined) delete _data.method

    // At this point we know it is error
    const error: DiscordAPIErrorPayload = {
      url: new URL(response.url).pathname,
      status,
      method: data.method,
      code: body?.code,
      message: body?.message,
      errors: body?.errors ?? {},
      requestData: _data
    }

    if (
      [
        HttpResponseCode.BadRequest,
        HttpResponseCode.NotFound,
        HttpResponseCode.Forbidden,
        HttpResponseCode.MethodNotAllowed
      ].includes(status)
    ) {
      reject(new DiscordAPIError(error))
    } else if (status === HttpResponseCode.GatewayUnavailable) {
      reject(new DiscordAPIError(error))
    } else reject(new DiscordAPIError('Request - Unknown Error'))
  }

  /**
   * Makes a Request to Discord API.
   * @param method HTTP Method to use
   * @param url URL of the Request
   * @param body Body to send with Request
   * @param maxRetries Number of Max Retries to perform
   * @param bucket BucketID of the Request
   * @param rawResponse Whether to get Raw Response or body itself
   */
  async make(
    method: RequestMethods,
    url: string,
    body?: unknown,
    maxRetries = 0,
    bucket?: string | null,
    rawResponse?: boolean
  ): Promise<any> {
    return await new Promise((resolve, reject) => {
      const onComplete = async (): Promise<undefined | any> => {
        try {
          const rateLimitResetIn = await this.isRateLimited(url)
          if (rateLimitResetIn !== false) {
            return {
              rateLimited: rateLimitResetIn,
              before: true,
              bucket
            }
          }

          const query =
            method === 'get' && body !== undefined
              ? Object.entries(body as any)
                  .filter(([k, v]) => v !== undefined)
                  .map(
                    ([key, value]) =>
                      `${encodeURIComponent(key)}=${encodeURIComponent(
                        value as any
                      )}`
                  )
                  .join('&')
              : ''
          let urlToUse =
            method === 'get' && query !== '' ? `${url}?${query}` : url

          // It doesn't start with HTTP, that means it's an incomplete URL
          if (!urlToUse.startsWith('http')) {
            if (!urlToUse.startsWith('/')) urlToUse = `/${urlToUse}`
            urlToUse =
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              Constants.DISCORD_API_URL +
              '/v' +
              Constants.DISCORD_API_VERSION +
              urlToUse
          }

          if (this.canary === true && urlToUse.startsWith('http')) {
            const split = urlToUse.split('//')
            urlToUse = split[0] + '//canary.' + split[1]
          }

          const requestData = this.prepare(body, method)

          const response = await fetch(urlToUse, requestData)
          const bucketFromHeaders = this.processHeaders(url, response.headers)

          if (response.status === 204)
            return resolve(
              rawResponse === true ? { response, body: null } : undefined
            )

          const json: any = await response.json()
          await this.handleStatusCode(response, json, requestData, reject)

          if (
            json.retry_after !== undefined ||
            json.message === 'You are being rate limited.'
          ) {
            if (maxRetries > 10) {
              throw new Error('Max RateLimit Retries hit')
            }

            return {
              rateLimited: json.retry_after,
              before: false,
              bucket: bucketFromHeaders
            }
          }
          return resolve(rawResponse === true ? { response, body: json } : json)
        } catch (error) {
          return reject(error)
        }
      }

      this.queue({
        onComplete,
        bucket,
        url
      })
      if (!this.processing) {
        this.processing = true
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.processQueue()
      }
    })
  }

  /** Checks for RateLimits times and deletes if already over */
  private handleRateLimits(): void {
    const now = Date.now()
    this.rateLimits.forEach((value, key) => {
      // Ratelimit has not ended
      if (value.resetAt > now) return
      // It ended, so delete
      this.rateLimits.delete(key)
      if (key === 'global') this.globalRateLimit = false
    })
  }

  /** Makes a GET Request to API */
  async get(
    url: string,
    body?: unknown,
    maxRetries = 0,
    bucket?: string | null,
    rawResponse?: boolean
  ): Promise<any> {
    return await this.make('get', url, body, maxRetries, bucket, rawResponse)
  }

  /** Makes a POST Request to API */
  async post(
    url: string,
    body?: unknown,
    maxRetries = 0,
    bucket?: string | null,
    rawResponse?: boolean
  ): Promise<any> {
    return await this.make('post', url, body, maxRetries, bucket, rawResponse)
  }

  /** Makes a DELETE Request to API */
  async delete(
    url: string,
    body?: unknown,
    maxRetries = 0,
    bucket?: string | null,
    rawResponse?: boolean
  ): Promise<any> {
    return await this.make('delete', url, body, maxRetries, bucket, rawResponse)
  }

  /** Makes a PATCH Request to API */
  async patch(
    url: string,
    body?: unknown,
    maxRetries = 0,
    bucket?: string | null,
    rawResponse?: boolean
  ): Promise<any> {
    return await this.make('patch', url, body, maxRetries, bucket, rawResponse)
  }

  /** Makes a PUT Request to API */
  async put(
    url: string,
    body?: unknown,
    maxRetries = 0,
    bucket?: string | null,
    rawResponse?: boolean
  ): Promise<any> {
    return await this.make('put', url, body, maxRetries, bucket, rawResponse)
  }
}
