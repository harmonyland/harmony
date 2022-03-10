import type { Client } from '../client/mod.ts'
import { Base } from '../structures/base.ts'
import { Collection } from '../utils/collection.ts'

// unknown does not work here.
type TDataType<T, T2> = new (client: Client, raw: T, ...args: any[]) => T2

/**
 * Managers handle caching data. And also some REST Methods as required.
 *
 * You should not be making Managers yourself.
 */
export class BaseManager<T, T2> extends Base {
  /** Caches Name or Key used to differentiate caches */
  cacheName: string
  /** Which data type does this cache have */
  DataType: TDataType<T, T2>

  constructor(client: Client, cacheName: string, DataType: TDataType<T, T2>) {
    super(client)
    this.cacheName = cacheName
    this.DataType = DataType
  }

  /** Gets raw value from a cache (payload) */
  async _get(key: string): Promise<T | undefined> {
    return this.client.cache.get(this.cacheName, key)
  }

  /** Gets a value from Cache */
  async get(key: string): Promise<T2 | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return
    return new this.DataType(this.client, raw)
  }

  /** Sets a value to Cache */
  async set(key: string, value: T): Promise<void> {
    await this.client.cache.set(this.cacheName, key, value)
  }

  /** Deletes a key from Cache */
  async _delete(key: string): Promise<boolean> {
    return this.client.cache.delete(this.cacheName, key)
  }

  // any for backward compatibility and args: unknown[] for allowing
  // extending classes to extend number of arguments required.
  async delete(key: string, ...args: unknown[]): Promise<any> {}

  /** Gets an Array of values from Cache */
  async array(): Promise<T2[]> {
    let arr = await (this.client.cache.array(this.cacheName) as T[])
    if (arr === undefined) arr = []
    return arr.map((e) => new this.DataType(this.client, e))
  }

  /** Gets a Collection of values from Cache */
  async collection(): Promise<Collection<string, T2>> {
    const arr = await this.array()
    if (arr === undefined) return new Collection()
    const collection = new Collection()
    for (const elem of arr) {
      // @ts-expect-error
      collection.set(elem.id, elem)
    }
    return collection
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<T2> {
    for (const data of (await this.array()) ?? []) {
      yield data
    }
  }

  async fetch(...args: unknown[]): Promise<T2 | undefined> {
    return undefined
  }

  /** Try to get value from cache, if not found then fetch */
  async resolve(key: string): Promise<T2 | undefined> {
    const cacheValue = await this.get(key)
    if (cacheValue !== undefined) return cacheValue
    else {
      const fetchValue = await this.fetch(key).catch(() => undefined)
      if (fetchValue !== undefined) return fetchValue
    }
  }

  /** Deletes everything from Cache */
  async flush(): Promise<void> {
    await this.client.cache.deleteCache(this.cacheName)
  }

  /** Gets number of values stored in Cache */
  async size(): Promise<number> {
    return (await this.client.cache.size(this.cacheName)) ?? 0
  }

  /** Gets all keys in the cache (mostly snowflakes) */
  async keys(): Promise<string[]> {
    return (await this.client.cache.keys(this.cacheName)) ?? []
  }

  [Symbol.for('Deno.customInspect')](): string {
    return `Manager(${this.cacheName})`
  }
}
