import { Client } from '../models/client.ts'
import * as cache from '../models/cache.ts'
import endpoints from '../types/endpoint.ts'

interface IInit {
  useCache?: boolean
  endpoint: string
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
    this.restFunc = endpoints.find(v => v.name === endpoint)
    // TODO: Make error for this
    if (this.restFunc !== undefined) {
      const resp = await fetch(this.restFunc(...restURLfuncArgs), {
        headers: {
          Authorization: `Bot ${client.token}`
        }
      })
      const jsonParsed = await resp.json()

      cache.set(
        this.cacheName ?? this.name,
        cacheID,
        new this(client, jsonParsed)
      )

      return new this(client, jsonParsed)
    }
  }

  async refreshFromAPI (
    client: Client,
    { endpoint, restURLfuncArgs }: IInit
  ): Promise<this> {
    const oldOne = Object.assign(Object.create(this), this)
    const restFunc:
      | ((...restURLfuncArgs: string[]) => string)
      | undefined = endpoints.find(v => v.name === endpoint)
    // TODO: Make error for this
    if (restFunc !== undefined) {
      const resp = await fetch(restFunc(...restURLfuncArgs), {
        headers: {
          Authorization: `Bot ${client.token}`
        }
      })
      const jsonParsed = await resp.json()
      const result: { [k: string]: any } = {}
      Object.keys(jsonParsed).forEach(key => {
        result[this.convertPropertyNameToStandard(key)] = jsonParsed[key]
      })

      Object.assign(this, result)
    }

    return oldOne
  }

  refreshFromData (data: { [k: string]: any }): this {
    const oldOne = Object.assign(Object.create(this), this)
    const result: { [k: string]: any } = {}
    Object.keys(data).forEach(key => {
      result[this.convertPropertyNameToStandard(key)] = data[key]
    })

    Object.assign(this, result)
    return oldOne
  }

  convertPropertyNameToStandard (name: string): string {
    if (name in this.propertyConverterOverride) {
      return this.propertyConverterOverride[name]
    }

    name = name.replaceAll('_id', 'ID')
    name = name
      .split('_')
      .map((value, index) => {
        if (index !== 0) {
          value = value[0].toUpperCase() + value.slice(1)
        }
        return value
      })
      .join('')
    return name
  }

  // toJSON() {}
}

// 오류를 해결하기 위해 저는 2개로 접속하겠습니다. VS2019
