import { Client } from '../models/client.ts'
import * as cache from '../models/cache.ts'
import endpoint from '../types/endpoint.ts'

interface IInit {
  useCache?: boolean
  cacheName: string
  endpoint: string,
  restURLfuncArgs: string[]
}

export class Base {
  client: Client
  static useCache?: boolean = true
  static restFunc: ((...restURLfuncArgs: any) => string)[]

  constructor (client: Client, _data: any) {
    this.client = client
  }

  static async autoInit (client: Client, init: IInit) {
    this.useCache = init.useCache;
    const cacheID = init.restURLfuncArgs.join(':')
    if (this.useCache) {
      const cached = cache.get(
        init.cacheName,
        cacheID
      )
      if (cached !== undefined) {
        return cached
      }
    }

    this.restFunc = endpoint.filter(v => v.name === init.endpoint)

    const resp = await fetch(this.restFunc[0](init.restURLfuncArgs[0], init.restURLfuncArgs[1], init.restURLfuncArgs[2], init.restURLfuncArgs[3]), {
      headers: {
        Authorization: `Bot ${client.token}`
      }
    })

    const jsonParsed = await resp.json()

    cache.set(init.cacheName, cacheID, new this(client, jsonParsed))

    return new this(client, jsonParsed)
  }

  async refresh (client: Client, init: IInit) {
    const restFunc: ((...restURLfuncArgs: any) => string)[] = endpoint.filter(v => v.name === init.endpoint)

    const resp = await fetch(restFunc[0](init.restURLfuncArgs[0], init.restURLfuncArgs[1], init.restURLfuncArgs[3], init.restURLfuncArgs[4]), {
      headers: {
        Authorization: `Bot ${client.token}`
      }
    })
    const jsonParsed = await resp.json()

    Object.assign(this, jsonParsed)
  }
}
