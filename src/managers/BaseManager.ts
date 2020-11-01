import { Client } from "../models/client.ts";
import { Collection } from "../utils/collection.ts";

export class BaseManager<T, T2> {
  client: Client
  cacheName: string
  dataType: any

  constructor(client: Client, cacheName: string, dataType: any) {
    this.client = client
    this.cacheName = cacheName
    this.dataType = dataType
  }

  _get(key: string): Promise<T> {
    return this.client.cache.get(this.cacheName, key) as Promise<T>
  }

  async get(key: string): Promise<T2 | void> {
    const raw = await this._get(key)
    if(!raw) return
    return new this.dataType(this.client, raw) as any
  }

  set(key: string, value: T) {
    return this.client.cache.set(this.cacheName, key, value)
  }

  delete(key: string) {
    return this.client.cache.delete(this.cacheName, key)
  }

  array(): Promise<void | T2[]> {
    return (this.client.cache.array(this.cacheName) as T[]).map(e => new this.dataType(this.client, e)) as any
  }

  async collection(): Promise<Collection<string, T2>> {
    const arr = await this.array() as void | T2[]
    if(arr === undefined) return new Collection()
    let collection = new Collection()
    for (const elem of arr) {
      // @ts-ignore
      collection.set(elem.id, elem)
    }
    return collection
  }
}