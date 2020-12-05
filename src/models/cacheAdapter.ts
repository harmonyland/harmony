import { Collection } from '../utils/collection.ts'
import {
  connect,
  Redis,
  RedisConnectOptions
} from 'https://denopkg.com/keroxp/deno-redis/mod.ts'

/**
 * ICacheAdapter is the interface to be implemented by Cache Adapters for them to be usable with Harmony.
 *
 * Methods can return Promises too.
 */
export interface ICacheAdapter {
  /** Gets a key from a Cache */
  get: (cacheName: string, key: string) => Promise<any> | any
  /** Sets a key to value in a Cache Name with optional expire value in MS */
  set: (
    cacheName: string,
    key: string,
    value: any,
    expire?: number
  ) => Promise<any> | any
  /** Deletes a key from a Cache */
  delete: (cacheName: string, key: string) => Promise<boolean> | boolean
  /** Gets array of all values in a Cache */
  array: (cacheName: string) => undefined | any[] | Promise<any[] | undefined>
  /** Entirely deletes a Cache */
  deleteCache: (cacheName: string) => any
}

/** Default Cache Adapter for in-memory caching. */
export class DefaultCacheAdapter implements ICacheAdapter {
  data: {
    [name: string]: Collection<string, any>
  } = {}

  async get(cacheName: string, key: string): Promise<undefined | any> {
    const cache = this.data[cacheName]
    if (cache === undefined) return
    return cache.get(key)
  }

  async set(
    cacheName: string,
    key: string,
    value: any,
    expire?: number
  ): Promise<any> {
    let cache = this.data[cacheName]
    if (cache === undefined) {
      this.data[cacheName] = new Collection()
      cache = this.data[cacheName]
    }
    cache.set(key, value)
    if (expire !== undefined)
      setTimeout(() => {
        cache.delete(key)
      }, expire)
  }

  async delete(cacheName: string, key: string): Promise<boolean> {
    const cache = this.data[cacheName]
    if (cache === undefined) return false
    return cache.delete(key)
  }

  async array(cacheName: string): Promise<any[] | undefined> {
    const cache = this.data[cacheName]
    if (cache === undefined) return
    return cache.array()
  }

  async deleteCache(cacheName: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    return delete this.data[cacheName]
  }
}

/** Redis Cache Adatper for using Redis as a cache-provider. */
export class RedisCacheAdapter implements ICacheAdapter {
  _redis: Promise<Redis>
  redis?: Redis
  ready: boolean = false
  readonly _expireIntervalTimer: number = 5000
  private _expireInterval?: number

  constructor(options: RedisConnectOptions) {
    this._redis = connect(options)
    this._redis.then(
      (redis) => {
        this.redis = redis
        this.ready = true
        this._startExpireInterval()
      },
      () => {
        // TODO: Make error for this
      }
    )
  }

  private _startExpireInterval(): void {
    this._expireInterval = setInterval(() => {
      this.redis?.scan(0, { pattern: '*:expires' }).then(([_, names]) => {
        for (const name of names) {
          this.redis?.hvals(name).then((vals) => {
            for (const val of vals) {
              const expireVal: {
                name: string
                key: string
                at: number
              } = JSON.parse(val)
              const expired = new Date().getTime() > expireVal.at
              if (expired) this.redis?.hdel(expireVal.name, expireVal.key)
            }
          })
        }
      })
    }, this._expireIntervalTimer)
  }

  async _checkReady(): Promise<void> {
    if (!this.ready) await this._redis
  }

  async get(cacheName: string, key: string): Promise<string | undefined> {
    await this._checkReady()
    const cache = await this.redis?.hget(cacheName, key)
    if (cache === undefined) return
    try {
      return JSON.parse(cache)
    } catch (e) {
      return cache
    }
  }

  async set(
    cacheName: string,
    key: string,
    value: any,
    expire?: number
  ): Promise<number | undefined> {
    await this._checkReady()
    const result = await this.redis?.hset(
      cacheName,
      key,
      typeof value === 'object' ? JSON.stringify(value) : value
    )
    if (expire !== undefined) {
      await this.redis?.hset(
        `${cacheName}:expires`,
        key,
        JSON.stringify({
          name: cacheName,
          key,
          at: new Date().getTime() + expire
        })
      )
    }
    return result
  }

  async delete(cacheName: string, key: string): Promise<boolean> {
    await this._checkReady()
    const exists = await this.redis?.hexists(cacheName, key)
    if (exists === 0) return false
    await this.redis?.hdel(cacheName, key)
    return true
  }

  async array(cacheName: string): Promise<any[] | undefined> {
    await this._checkReady()
    const data = await this.redis?.hvals(cacheName)
    return data?.map((e: string) => JSON.parse(e))
  }

  async deleteCache(cacheName: string): Promise<boolean> {
    await this._checkReady()
    return (await this.redis?.del(cacheName)) !== 0
  }
}
