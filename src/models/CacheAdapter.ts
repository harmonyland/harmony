import { Collection } from "../utils/collection.ts";
import { Client } from "./client.ts";

export interface ICacheAdapter {
  client: Client
  get: (cacheName: string, key: string) => any
  set: (cacheName: string, key: string, value: any) => any
  delete: (cacheName: string, key: string) => boolean
  array: (cacheName: string) => void | any[]
}

export class DefaultCacheAdapter implements ICacheAdapter {
  client: Client
  data: {
    [name: string]: Collection<string, any>
  } = {}

  constructor(client: Client) {
    this.client = client
  }

  get(cacheName: string, key: string) {
    const cache = this.data[cacheName]
    if (!cache) return;
    return cache.get(key)
  }

  set(cacheName: string, key: string, value: any) {
    let cache = this.data[cacheName]
    if (!cache) {
      this.data[cacheName] = new Collection()
      cache = this.data[cacheName]
    }
    cache.set(key, value)
  }

  delete(cacheName: string, key: string) {
    const cache = this.data[cacheName]
    if (!cache) return false
    return cache.delete(key)
  }

  array(cacheName: string) {
    const cache = this.data[cacheName]
    if (!cache) return
    return cache.array()
  }
}