import { Collection } from '../utils/collection.ts'
import type { ICacheAdapter } from './adapter.ts'

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
