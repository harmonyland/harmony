import { Collection } from '../utils/collection.ts'
import type { ICacheAdapter } from './adapter.ts'

/** Default Cache Adapter for in-memory caching. */
export class DefaultCacheAdapter implements ICacheAdapter {
  // we're using Map here because we don't utilize Collection's methods
  data = new Map<string, Collection<string, unknown>>()

  get<T>(cacheName: string, key: string): T | undefined {
    return this.data.get(cacheName)?.get(key) as T | undefined
  }

  set<T>(cacheName: string, key: string, value: T, expire?: number): void {
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

  array<T>(cacheName: string): T[] | undefined {
    return this.data.get(cacheName)?.array() as T[] | undefined
  }

  deleteCache(cacheName: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    return this.data.delete(cacheName)
  }

  size<T>(
    cacheName: string,
    filter?: (payload: T) => boolean
  ): number | undefined {
    const cache = this.data.get(cacheName)
    if (cache === undefined) return
    return filter !== undefined
      ? cache.filter(filter as (value: unknown, key: string) => boolean).size
      : cache.size
  }

  keys(cacheName: string): string[] | undefined {
    const cache = this.data.get(cacheName)
    if (cache === undefined) return
    return [...cache.keys()]
  }
}
