import { ICacheAdapter } from './adapter.ts'
// Not in deps.ts to allow optional dep loading
import { createClient, RedisClientOptions } from 'npm:redis@4.6.13'

/** Redis Cache Adapter for using Redis as a cache-provider. */
export class RedisCacheAdapter implements ICacheAdapter {
  _redis: Promise<ReturnType<typeof createClient>>
  redis?: ReturnType<typeof createClient>
  ready: boolean = false
  readonly _expireIntervalTimer: number = 5000
  private _expireInterval?: number

  constructor(options: RedisClientOptions) {
    this._redis = createClient(options).connect()
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
      this.redis?.scan(0, { MATCH: '*:expires' }).then(({ keys: names }) => {
        for (const name of names) {
          this.redis?.hVals(name).then((vals) => {
            for (const val of vals) {
              const expireVal: {
                name: string
                key: string
                at: number
              } = JSON.parse(val)
              const expired = new Date().getTime() > expireVal.at
              if (expired) this.redis?.hDel(expireVal.name, expireVal.key)
            }
          })
        }
      })
    }, this._expireIntervalTimer)
  }

  async _checkReady(): Promise<void> {
    if (!this.ready) await this._redis
  }

  async get<T>(cacheName: string, key: string): Promise<T | undefined> {
    await this._checkReady()
    const cache = await this.redis?.hGet(cacheName, key)
    if (cache === undefined) return
    try {
      return JSON.parse(cache) as T
    } catch (e) {
      return cache as unknown as T
    }
  }

  async set<T>(
    cacheName: string,
    key: string,
    value: T,
    expire?: number
  ): Promise<void> {
    await this._checkReady()
    await this.redis?.hSet(
      cacheName,
      key,
      typeof value === 'object' ? JSON.stringify(value) : (value as any)
    )
    if (expire !== undefined) {
      await this.redis?.hSet(
        `${cacheName}:expires`,
        key,
        JSON.stringify({
          name: cacheName,
          key,
          at: new Date().getTime() + expire
        })
      )
    }
  }

  async delete(cacheName: string, ...keys: string[]): Promise<boolean> {
    await this._checkReady()
    return ((await this.redis?.hDel(cacheName, keys)) ?? 0) === keys.length
  }

  async array<T>(cacheName: string): Promise<T[] | undefined> {
    await this._checkReady()
    const data = await this.redis?.hVals(cacheName)
    return data?.map((e: string) => JSON.parse(e))
  }

  async keys(cacheName: string): Promise<string[] | undefined> {
    await this._checkReady()
    return this.redis?.hKeys(cacheName)
  }

  async deleteCache(cacheName: string): Promise<boolean> {
    await this._checkReady()
    return (await this.redis?.del(cacheName)) !== 0
  }

  async size(cacheName: string): Promise<number | undefined> {
    await this._checkReady()
    return this.redis?.hLen(cacheName)
  }
}
