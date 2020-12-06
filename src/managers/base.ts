import { Client } from '../models/client.ts'
import { Collection } from '../utils/collection.ts'

/**
 * Managers handle caching data. And also some REST Methods as required.
 *
 * You should not be making Managers yourself.
 */
export class BaseManager<T, T2> {
  client: Client
  /** Caches Name or Key used to differentiate caches */
  cacheName: string
  /** Which data type does this cache have */
  DataType: any

  constructor(client: Client, cacheName: string, DataType: any) {
    this.client = client
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
  async set(key: string, value: T): Promise<any> {
    return this.client.cache.set(this.cacheName, key, value)
  }

  /** Deletes a key from Cache */
  async delete(key: string): Promise<boolean> {
    return this.client.cache.delete(this.cacheName, key)
  }

  /** Gets an Array of values from Cache */
  async array(): Promise<undefined | T2[]> {
    let arr = await (this.client.cache.array(this.cacheName) as T[])
    if (arr === undefined) arr = []
    return arr.map((e) => new this.DataType(this.client, e)) as any
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

  /** Deletes everything from Cache */
  flush(): any {
    return this.client.cache.deleteCache(this.cacheName)
  }
}
