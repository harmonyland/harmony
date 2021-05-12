import { Collection } from '../utils/collection.ts'
import type { ICacheAdapter } from './adapter.ts'

/** Default Cache Adapter for in-memory caching. */
export class DefaultCacheAdapter implements ICacheAdapter {
  data: {
    [name: string]: Collection<string, any>
  } = {}

  async get(cacheName: string, key: string): Promise<undefined | any> {
    return this.data[cacheName]?.get(key)
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
      setTimeout(cache.delete, expire, key)
  }

  async delete(cacheName: string, key: string): Promise<boolean> {
    return this.data[cacheName]?.delete(key) ?? false
  }

  async array(cacheName: string): Promise<any[] | undefined> {
    return this.data[cacheName]?.array()
  }

  async deleteCache(cacheName: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    return delete this.data[cacheName]
  }
}
