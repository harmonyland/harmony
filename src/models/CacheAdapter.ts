import { Collection } from '../utils/collection.ts'
import { Client } from './client.ts'
import {
  connect,
  Redis,
  RedisConnectOptions
} from 'https://denopkg.com/keroxp/deno-redis/mod.ts'

export interface ICacheAdapter {
  client: Client
  get: (cacheName: string, key: string) => Promise<undefined | any>
  set: (cacheName: string, key: string, value: any) => Promise<any>
  delete: (cacheName: string, key: string) => Promise<boolean>
  array: (cacheName: string) => Promise<any[] | undefined>
}

export class DefaultCacheAdapter implements ICacheAdapter {
  client: Client
  data: {
    [name: string]: Collection<string, any>
  } = {}

  constructor (client: Client) {
    this.client = client
  }

  async get (cacheName: string, key: string): Promise<undefined | any> {
    const cache = this.data[cacheName]
    if (cache === undefined) return
    return cache.get(key)
  }

  async set (cacheName: string, key: string, value: any): Promise<any> {
    let cache = this.data[cacheName]
    if (cache === undefined) {
      this.data[cacheName] = new Collection()
      cache = this.data[cacheName]
    }
    return cache.set(key, value)
  }

  async delete (cacheName: string, key: string): Promise<boolean> {
    const cache = this.data[cacheName]
    if (cache === undefined) return false
    return cache.delete(key)
  }

  async array (cacheName: string): Promise<any[] | undefined> {
    const cache = this.data[cacheName]
    if (cache === undefined) return
    return cache.array()
  }
}

export class RedisCacheAdapter implements ICacheAdapter {
  client: Client
  _redis: Promise<Redis>
  redis?: Redis
  ready: boolean = false

  constructor (client: Client, options: RedisConnectOptions) {
    this.client = client
    this._redis = connect(options)
    this._redis.then(
      redis => {
        this.redis = redis
        this.ready = true
      },
      () => {
        // TODO: Make error for this
      }
    )
  }

  async _checkReady (): Promise<void> {
    if (!this.ready) await this._redis
  }

  async get (cacheName: string, key: string): Promise<string | undefined> {
    await this._checkReady()
    const cache = await this.redis?.hget(cacheName, key)
    if (cache === undefined) return
    try {
      return JSON.parse(cache)
    } catch (e) {
      return cache
    }
  }

  async set (
    cacheName: string,
    key: string,
    value: any
  ): Promise<number | undefined> {
    await this._checkReady()
    const result = await this.redis?.hset(
      cacheName,
      key,
      typeof value === 'object' ? JSON.stringify(value) : value
    )
    return result
  }

  async delete (cacheName: string, key: string): Promise<boolean> {
    await this._checkReady()
    const exists = await this.redis?.hexists(cacheName, key)
    if (exists === 0) return false
    await this.redis?.hdel(cacheName, key)
    return true
  }

  async array (cacheName: string): Promise<any[] | undefined> {
    await this._checkReady()
    const data = await this.redis?.hvals(cacheName)
    return data?.map((e: string) => JSON.parse(e))
  }
}
