import { Client } from '../models/client.ts'
import * as cache from '../models/cache.ts'

interface IInit {
  useCache?: boolean
  endpoint: (...restURLfuncArgs: string[]) => string
  restURLfuncArgs: string[]
}

export class Base {
  client: Client
  static cacheName?: string
  propertyConverterOverride: { [k: string]: string } = {}
  static useCache?: boolean = true
  static restFunc?: (...restURLfuncArgs: string[]) => string

  constructor (client: Client, _data?: any) {
    this.client = client
  }

  static async autoInit (
    client: Client,
    { useCache, endpoint, restURLfuncArgs }: IInit
  ): Promise<any> {
    this.useCache = useCache
    const cacheID = restURLfuncArgs.join(':')
    if (this.useCache !== undefined) {
      const cached = cache.get(this.cacheName ?? this.name, cacheID)
      if (cached !== undefined) {
        return cached
      }
    }

    const resp = await fetch(endpoint(...restURLfuncArgs), {
      headers: {
        Authorization: `Bot ${client.token}`
      }
    })
    const jsonParsed = await resp.json()

    return new this(client, jsonParsed)
  }

  async refreshFromAPI (
    client: Client,
    { endpoint, restURLfuncArgs }: IInit
  ): Promise<this> {
    const oldOne = Object.assign(Object.create(this), this)

    const resp = await fetch(endpoint(...restURLfuncArgs), {
      headers: {
        Authorization: `Bot ${client.token}`
      }
    })
    const jsonParsed = await resp.json()

    this.readFromData(jsonParsed)

    return oldOne
  }

  refreshFromData (data: { [k: string]: any }): this {
    const oldOne = Object.assign(Object.create(this), this)
    this.readFromData(data)
    return oldOne
  }

  protected readFromData (data: { [k: string]: any }): void {}

  // toJSON() {}
}
