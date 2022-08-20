// based on https://github.com/discordjs/discord.js/blob/master/src/rest/RequestHandler.js
// adapted to work with harmony rest manager

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import { delay } from '../utils/delay.ts'
import { DiscordAPIError, HTTPError } from './error.ts'
import type { RESTManager } from './manager.ts'
import { RequestQueue } from './queue.ts'
import { APIRequest } from './request.ts'

// It returns JSON objects which are untyped so
async function parseResponse(res: Response, raw: boolean): Promise<any> {
  let result
  if (res.status === 204) result = Promise.resolve(undefined)
  else if (
    res.headers.get('content-type')?.startsWith('application/json') === true
  )
    result = res.json()
  else result = await res.arrayBuffer().then((e) => new Uint8Array(e))

  if (raw) {
    return { response: res, body: result }
  } else return result
}

function getAPIOffset(serverDate: number | string): number {
  return new Date(serverDate).getTime() - Date.now()
}

function calculateReset(
  reset: number | string,
  serverDate: number | string
): number {
  return new Date(Number(reset) * 1000).getTime() - getAPIOffset(serverDate)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let invalidCount = 0
let invalidCountResetTime: number | null = null

export class BucketHandler {
  queue = new RequestQueue()
  reset = -1
  remaining = -1
  limit = -1

  constructor(public manager: RESTManager) {}

  // Returns Response (untyped JSON)
  async push(request: APIRequest): Promise<any> {
    await this.queue.wait()
    let res
    try {
      res = await this.execute(request)
    } finally {
      this.queue.shift()
    }
    return res
  }

  get globalLimited(): boolean {
    return (
      this.manager.globalRemaining <= 0 &&
      Date.now() < Number(this.manager.globalReset)
    )
  }

  get localLimited(): boolean {
    return this.remaining <= 0 && Date.now() < this.reset
  }

  get limited(): boolean {
    return this.globalLimited || this.localLimited
  }

  get inactive(): boolean {
    return this.queue.remaining === 0 && !this.limited
  }

  async globalDelayFor(ms: number): Promise<void> {
    return await new Promise((resolve) => {
      this.manager.setTimeout(() => {
        this.manager.globalDelay = null
        resolve()
      }, ms)
    })
  }

  async execute(request: APIRequest): Promise<any> {
    while (this.limited) {
      const isGlobal = this.globalLimited
      let limit, timeout, delayPromise

      if (isGlobal) {
        limit = this.manager.globalLimit
        timeout =
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          Number(this.manager.globalReset) +
          this.manager.restTimeOffset -
          Date.now()
        if (typeof this.manager.globalDelay !== 'number') {
          this.manager.globalDelay = this.globalDelayFor(timeout)
        }
        delayPromise = this.manager.globalDelay
      } else {
        limit = this.limit
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        timeout = this.reset + this.manager.restTimeOffset - Date.now()
        delayPromise = delay(timeout)
      }

      this.manager.client?.emit('rateLimit', {
        timeout,
        limit,
        method: request.method,
        path: request.path,
        global: isGlobal
      })

      await delayPromise
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.manager.globalReset || this.manager.globalReset < Date.now()) {
      this.manager.globalReset = Date.now() + 1000
      this.manager.globalRemaining = this.manager.globalLimit
    }
    this.manager.globalRemaining--

    // Perform the request
    let res
    try {
      res = await request.execute()
    } catch (_error) {
      // For backward compatibility.
      const error = _error as HTTPError
      if (request.retries === this.manager.retryLimit) {
        throw new HTTPError(
          error.message,
          error.constructor.name,
          error.code,
          request.method,
          request.path
        )
      }

      request.retries++
      return await this.execute(request)
    }

    let sublimitTimeout
    if (res?.headers !== undefined) {
      const serverDate = res.headers.get('date')
      const limit = res.headers.get('x-ratelimit-limit')
      const remaining = res.headers.get('x-ratelimit-remaining')
      const reset = res.headers.get('x-ratelimit-reset')
      this.limit = limit !== null ? Number(limit) : Infinity
      this.remaining = remaining !== null ? Number(remaining) : 1
      this.reset =
        reset !== null ? calculateReset(reset, serverDate!) : Date.now()

      if (request.path.includes('reactions') === true) {
        this.reset =
          new Date(serverDate!).getTime() - getAPIOffset(serverDate!) + 250
      }

      let retryAfter: number | null | string = res.headers.get('retry-after')
      retryAfter = retryAfter !== null ? Number(retryAfter) * 1000 : -1
      if (retryAfter > 0) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (res.headers.get('x-ratelimit-global')) {
          this.manager.globalRemaining = 0
          this.manager.globalReset = Date.now() + retryAfter
        } else if (!this.localLimited) {
          sublimitTimeout = retryAfter
        }
      }
    }

    if (res.status === 401 || res.status === 403 || res.status === 429) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!invalidCountResetTime || invalidCountResetTime < Date.now()) {
        invalidCountResetTime = Date.now() + 1000 * 60 * 10
        invalidCount = 0
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      invalidCount++
    }

    if (res.ok === true) {
      return await parseResponse(res, request.options.rawResponse ?? false)
    }

    if (res.status >= 400 && res.status < 500) {
      if (res.status === 429) {
        this.manager.client?.emit(
          'debug',
          `Rate-Limited on route ${request.path}${
            sublimitTimeout !== undefined ? ' for sublimit' : ''
          }`
        )

        if (sublimitTimeout !== undefined) {
          await delay(sublimitTimeout)
        }
        return await this.execute(request)
      }

      let data
      try {
        data = await parseResponse(res, false)
      } catch (_err) {
        const err = _err as HTTPError
        throw new HTTPError(
          err.message,
          err.constructor.name,
          err.code,
          request.method,
          request.path
        )
      }

      throw new DiscordAPIError({
        url: request.path,
        errors: data?.errors,
        status: res.status,
        method: request.method,
        message: data?.message,
        code: data?.code,
        requestData: request.options.data
      })
    }

    if (res.status >= 500 && res.status < 600) {
      if (request.retries === this.manager.retryLimit) {
        throw new HTTPError(
          res.statusText,
          res.constructor.name,
          res.status,
          request.method,
          request.path
        )
      }

      request.retries++
      return await this.execute(request)
    }

    return null
  }
}
