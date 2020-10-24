import { Client } from '../models/client.ts'
import * as cache from '../models/cache.ts'

export class Base {
  client: Client
  static useCache = true
  static cacheName: string
  static cacheArgIndex = 0
  static restFunc: (...restArgs: string[]) => string

  constructor (client: Client, _data?: any) {
    this.client = client
  }

  static async autoInit (client: Client, ...restURLfuncArgs: string[]) {
    if (this.useCache) {
      const cached = cache.get(
        this.cacheName,
        restURLfuncArgs[this.cacheArgIndex]
      )
      if (cached !== undefined && cached instanceof this) {
        return cached
      }
    }

    const resp = await fetch(this.restFunc(...restURLfuncArgs), {
      headers: {
        Authorization: `Bot ${client.token}`
      }
    })

    const jsonParsed = await resp.json()
    const initialized = new this(client, jsonParsed)
    cache.set(this.cacheName, restURLfuncArgs[this.cacheArgIndex], initialized)

    return initialized
  }
}
