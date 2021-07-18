import { Collection } from '../utils/collection.ts'
import type { ICacheAdapter } from './adapter.ts'

/** Default Cache Adapter for in-memory caching. */
export class DefaultCacheAdapter implements ICacheAdapter {
  // we're using Map here because we don't utilize Collection's methods
  data = new Map<string, Collection<string, any>>()

  get(cacheName: string, key: string): any {
    return this.data.get(cacheName)?.get(key)
  }

  set(cacheName: string, key: string, value: any, expire?: number): void {
    let cache = this.data.get(cacheName)
    if (cache === undefined) {
      cache = new Collection()
      this.data.set(cacheName, cache)
    }
    cache.set(key, value)
    if (expire !== undefined)
      setTimeout(() => {
        cache?.delete(key)
      }, expire)
  }

  delete(cacheName: string, ...keys: string[]): boolean {
    const cache = this.data.get(cacheName)
    if (cache === undefined) return false
    let deleted = true
    for (const key of keys) {
      if (cache.delete(key) === false) deleted = false
    }
    return deleted
  }

  array(cacheName: string): any[] | undefined {
    return this.data.get(cacheName)?.array()
  }

  deleteCache(cacheName: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    return this.data.delete(cacheName)
  }

  size(
    cacheName: string,
    filter?: (payload: any) => boolean
  ): number | undefined {
    const cache = this.data.get(cacheName)
    if (cache === undefined) return
    return filter !== undefined ? cache.filter(filter).size : cache.size
  }

  keys(cacheName: string): string[] | undefined {
    const cache = this.data.get(cacheName)
    if (cache === undefined) return
    return [...cache.keys()]
  }
}
