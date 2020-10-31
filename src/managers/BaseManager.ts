import { Client } from "../models/client.ts";
import { Base } from "../structures/base.ts";

export class BaseManager<T, T2> {
  client: Client
  cacheName: string
  dataType: typeof Base

  constructor(client: Client, cacheName: string, dataType: typeof Base) {
    this.client = client
    this.cacheName = cacheName
    this.dataType = dataType
  }

  _get(key: string): T {
    return this.client.cache.get(this.cacheName, key) as T
  }

  get(key: string): T2 | void {
    const raw = this._get(key)
    if(!raw) return
    return new this.dataType(this.client, raw) as any
  }

  set(key: string, value: T) {
    return this.client.cache.set(this.cacheName, key, value)
  }

  delete(key: string) {
    return this.client.cache.delete(this.cacheName, key)
  }
}