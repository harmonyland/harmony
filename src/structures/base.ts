import { Client } from '../models/client.ts'
import * as cache from '../models/cache.ts'
import endpoint from '../types/endpoint.ts'

interface IInit {
  cacheName: string
  endpoint: string,
  restURLfuncArgs: string[]
}

export class Base {
  client: Client
  static useCache = true
  static restFunc: ((...restURLfuncArgs: any) => string)[]

  constructor (client: Client) {
    this.client = client
  }

  static async autoInit (client: Client, init: IInit) {
    if (this.useCache) {
      const cached = cache.get(
        init.cacheName,
        init.restURLfuncArgs[0]
      )
      if (cached !== undefined) {
        return cached
      }
    }

    this.restFunc = endpoint.filter(v => v.name === init.endpoint)

    const resp = await fetch(this.restFunc[0](init.restURLfuncArgs), {
      headers: {
        Authorization: `Bot ${client.token}`
      }
    })

    const jsonParsed = await resp.json()

    cache.set(init.cacheName, init.restURLfuncArgs[0], jsonParsed)

    return jsonParsed
  }

  static async refresh (client: Client, target: any, init: IInit) {
    this.restFunc = endpoint.filter(v => v.name !== init.endpoint)

    const resp = await fetch(this.restFunc[0](init.restURLfuncArgs), {
      headers: {
        Authorization: `Bot ${client.token}`
      }
    })
    const jsonParsed = await resp.json()

    return Object.assign(target, jsonParsed)
  }
}
