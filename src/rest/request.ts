import type { Embed } from '../structures/embed.ts'
import type { MessageAttachment } from '../structures/message.ts'
import type { RESTManager } from './manager.ts'
import type { RequestMethods } from './types.ts'

export interface RequestOptions {
  headers?: { [name: string]: string }
  query?: { [name: string]: string }
  files?: MessageAttachment[]
  // Untyped JSON
  data?: any
  reason?: string
  rawResponse?: boolean
  route?: string
}

export class APIRequest {
  retries = 0
  route: string

  constructor(
    public rest: RESTManager,
    public method: RequestMethods,
    public path: string,
    public options: RequestOptions
  ) {
    this.route = options.route ?? path
    if (
      (method === 'get' || method === 'delete' || method === 'head') &&
      typeof options.data === 'object'
    ) {
      if (options.query !== undefined) {
        Object.assign(options.query, options.data)
      } else options.query = options.data
      options.data = undefined
    }
    if (typeof options.query === 'object') {
      const entries = Object.entries(options.query).filter(
        (e) => e[1] !== undefined && e[1] !== null
      )
      if (entries.length > 0) {
        this.path += '?'
        entries.forEach((entry, i) => {
          this.path += `${i === 0 ? '' : '&'}${encodeURIComponent(
            entry[0]
          )}=${encodeURIComponent(entry[1])}`
        })
      }
    }

    let _files: undefined | MessageAttachment[]
    if (
      options.data?.embed?.files !== undefined &&
      Array.isArray(options.data?.embed?.files)
    ) {
      _files = [...options.data?.embed?.files]
    }
    if (
      options.data?.embeds !== undefined &&
      Array.isArray(options.data?.embeds)
    ) {
      const files1 = options.data?.embeds
        .map((e: Embed) => e.files)
        .filter((e: MessageAttachment[]) => e !== undefined)
      for (const files of files1) {
        for (const file of files) {
          if (_files === undefined) _files = []
          _files?.push(file)
        }
      }
    }

    if (options.data?.file !== undefined) {
      if (_files === undefined) _files = []
      _files.push(options.data?.file)
    }

    if (
      options.data?.files !== undefined &&
      Array.isArray(options.data?.files)
    ) {
      if (_files === undefined) _files = []
      options.data?.files.forEach((file: MessageAttachment) => {
        _files!.push(file)
      })
    }

    if (_files !== undefined && _files.length > 0) {
      if (options.files === undefined) options.files = _files
      else options.files = [...options.files, ..._files]
    }
  }

  async execute(): Promise<Response> {
    let contentType: string | undefined
    let body: BodyInit | undefined
    if (
      this.method === 'post' ||
      this.method === 'put' ||
      this.method === 'patch'
    ) {
      body = this.options.data
      if (this.options.files !== undefined && this.options.files.length > 0) {
        contentType = undefined
        const form = new FormData()
        this.options.files.forEach((file, i) =>
          form.append(`file${i === 0 ? '' : i}`, file.blob, file.name)
        )
        form.append('payload_json', JSON.stringify(body))
        body = form
      } else if (body !== undefined && body instanceof FormData) {
        contentType = 'multipart/form-data'
      } else if (body !== undefined) {
        contentType = 'application/json'
        body = JSON.stringify(body)
      }
    }

    const controller = new AbortController()
    const timer = setTimeout(() => {
      controller.abort()
    }, this.rest.requestTimeout)
    this.rest.timers.add(timer)

    const url = this.path.startsWith('http')
      ? this.path
      : `${this.rest.apiURL}/v${this.rest.version}${this.path}`

    const headers: Record<string, string | undefined> = {
      'User-Agent':
        this.rest.userAgent ??
        `DiscordBot (harmony, https://github.com/harmonyland/harmony)`,
      Authorization:
        this.rest.token === undefined
          ? undefined
          : `${this.rest.tokenType} ${
              typeof this.rest.token === 'string'
                ? this.rest.token
                : this.rest.token()
            }`.trim()
    }

    // TODO: Remove once https://github.com/denoland/deno/issues/11920 is fixed
    if (
      (this.method === 'post' || this.method === 'put') &&
      (body === undefined || body === null)
    ) {
      headers['Content-Length'] = '0'
    }

    if (contentType !== undefined) headers['Content-Type'] = contentType

    const init: RequestInit = {
      method: this.method.toUpperCase(),
      signal: controller.signal,
      headers: Object.assign(headers, this.rest.headers, this.options.headers),
      body
    }

    if (this.options.reason !== undefined) {
      ;(init.headers as { [name: string]: string })['X-Audit-Log-Reason'] =
        encodeURIComponent(this.options.reason)
    }

    return fetch(url, init).finally(() => {
      clearTimeout(timer)
      this.rest.timers.delete(timer)
    })
  }
}
