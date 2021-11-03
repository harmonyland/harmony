import { simplifyAPIError } from '../utils/err_fmt.ts'
import { DiscordAPIErrorPayload } from './types.ts'

export class DiscordAPIError extends Error {
  name = 'DiscordAPIError'
  status: number
  error?: DiscordAPIErrorPayload

  constructor(error: string | DiscordAPIErrorPayload) {
    super()
    this.status = typeof error === 'string' ? -1 : error.status
    const fmt = Object.entries(
      typeof error === 'object' ? simplifyAPIError(error.errors ?? {}) : {}
    )
    this.message =
      typeof error === 'string'
        ? `${error} `
        : `\n${error.method.toUpperCase()} ${error.url} returned ${
            error.status
          }\n(${error.code ?? 'unknown'}) ${error.message}${
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

export class HTTPError extends Error {
  constructor(
    public message: string,
    public name: string,
    public code: number,
    public method: string,
    public path: string
  ) {
    super(message)
  }
}
