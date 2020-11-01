import { Client } from "../models/client.ts";
import { Base } from "../structures/base.ts";

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

  async set(key: string, value: T) {
    return this.client.cache.set(this.cacheName, key, value)
  }

  async delete(key: string) {
    return this.client.cache.delete(this.cacheName, key)
  }
}