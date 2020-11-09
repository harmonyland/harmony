import { delay } from '../utils/index.ts'
import * as baseEndpoints from '../consts/urlsAndVersions.ts'
import { Client } from './client.ts'
import { getBuildInfo } from '../utils/buildInfo.ts'
import { Collection } from '../utils/collection.ts'

export type RequestMethods = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete'

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

export interface QueuedItem {
  onComplete: () => Promise<{
    rateLimited: any
    bucket?: string | null
    before: boolean
  } | undefined>
  bucket?: string | null
  url: string
}

export interface RateLimit {
  url: string
  resetAt: number
  bucket: string | null
}

export class RESTManager {
  client: Client
  queues: { [key: string]: QueuedItem[] } = {}
  rateLimits = new Collection<string, RateLimit>()
  globalRateLimit: boolean = false
  processing: boolean = false

  constructor(client: Client) {
    this.client = client
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handleRateLimits()
  }

  async checkQueues(): Promise<void> {
    Object.entries(this.queues).forEach(([key, value]) => {
      if (value.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.queues[key]
      }
    })
  }

  queue(request: QueuedItem): void {
    const route = request.url.substring(
      // eslint seriously?
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      baseEndpoints.DISCORD_API_URL.length + 1
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

  async processQueue(): Promise<void> {
    if (Object.keys(this.queues).length !== 0 && !this.globalRateLimit) {
      await Promise.allSettled(
        Object.values(this.queues).map(async pathQueue => {
          const request = pathQueue.shift()
          if (request === undefined) return

          const rateLimitedURLResetIn = await this.isRateLimited(request.url)

          if (typeof request.bucket === 'string') {
            const rateLimitResetIn = await this.isRateLimited(
              request.bucket
            )
            if (rateLimitResetIn !== false) {
              // This request is still rate limited read to queue
              this.queue(request)
            } else {
              // This request is not rate limited so it should be run
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
              // This URL is rate limited readd to queue
              this.queue(request)
            } else {
              // This request has no bucket id so it should be processed
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
      await delay(1000)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.processQueue()
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.checkQueues()
    } else this.processing = false
  }

  prepare(
    body: any,
    method: RequestMethods
  ): { [key: string]: any } {

    const headers: RequestHeaders = {
      'Authorization': `Bot ${this.client.token}`,
      'User-Agent': `DiscordBot (harmony, https://github.com/harmony-org/harmony)`
    }

    if (this.client.token === undefined) delete headers.Authorization

    if (method === 'get' || method === 'head' || method === 'delete') body = undefined

    if (body?.reason !== undefined) {
      headers['X-Audit-Log-Reason'] = encodeURIComponent(body.reason)
    }

    if (body?.file !== undefined) {
      const form = new FormData()
      form.append('file', body.file.blob, body.file.name)
      form.append('payload_json', JSON.stringify({ ...body, file: undefined }))
      body.file = form
    } else if (body !== undefined && !['get', 'delete'].includes(method)) {
      headers['Content-Type'] = 'application/json'
    }

    const data: { [name: string]: any } = {
      headers,
      body: body?.file ?? JSON.stringify(body),
      method: method.toUpperCase()
    }

    if (this.client.bot === false) {
      // This is a selfbot. Use requests similar to Discord Client
      data.headers.authorization = this.client.token as string
      data.headers['accept-language'] = 'en-US'
      data.headers.accept = '*/*'
      data.headers['sec-fetch-dest'] = 'empty'
      data.headers['sec-fetch-mode'] = 'cors'
      data.headers['sec-fetch-site'] = 'same-origin'
      data.headers['x-super-properties'] = btoa(
        JSON.stringify(getBuildInfo(this.client))
      )
      delete data.headers['User-Agent']
      delete data.headers.Authorization
      headers.credentials = 'include'
      headers.mode = 'cors'
      headers.referrerPolicy = 'no-referrer-when-downgrade'
    }

    return data
  }

  async isRateLimited(url: string): Promise<number | false> {
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

  processHeaders(url: string, headers: Headers): string | null | undefined {
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

  async handleStatusCode(
    response: Response
  ): Promise<undefined> {
    const status = response.status

    if ((status >= 200 && status < 400) || status === HttpResponseCode.TooManyRequests) return

    const body = await response.json()
    const text = Deno.inspect(body.errors)

    if (status === HttpResponseCode.Unauthorized)
      throw new Error(`Request was not successful (Unauthorized). Invalid Token.\n${text}`)

    if ([
      HttpResponseCode.BadRequest,
      HttpResponseCode.NotFound,
      HttpResponseCode.Forbidden,
      HttpResponseCode.MethodNotAllowed
    ].includes(status)) {
      throw new Error(`Request - Client Error. Code: ${status}\n${text}`)
    } else if (status === HttpResponseCode.GatewayUnavailable) {
      throw new Error(`Request - Server Error. Code: ${status}\n${text}`)
    } else throw new Error('Request - Unknown Error')
  }

  async make(
    method: RequestMethods,
    url: string,
    body?: unknown,
    maxRetries = 0,
    bucket?: string | null
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

          if (this.client.canary === true) {
            const split = urlToUse.split('//')
            urlToUse = split[0] + '//canary.' + split[1]
          }

          const requestData = this.prepare(body, method)

          const response = await fetch(urlToUse, requestData)
          const bucketFromHeaders = this.processHeaders(url, response.headers)
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.handleStatusCode(response)

          if (response.status === 204) return resolve(undefined)

          const json = await response.json()
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
          return resolve(json)
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

  async handleRateLimits(): Promise<void> {
    const now = Date.now()
    this.rateLimits.forEach((value, key) => {
      if (value.resetAt > now) return
      this.rateLimits.delete(key)
      if (key === 'global') this.globalRateLimit = false
    })
  }

  async get(url: string, body?: unknown): Promise<any> {
    return await this.make('get', url, body)
  }

  async post(url: string, body?: unknown): Promise<any> {
    return await this.make('post', url, body)
  }

  async delete(url: string, body?: unknown): Promise<any> {
    return await this.make('delete', url, body)
  }

  async patch(url: string, body?: unknown): Promise<any> {
    return await this.make('patch', url, body)
  }

  async put(url: string, body?: unknown): Promise<any> {
    return await this.make('put', url, body)
  }
}
