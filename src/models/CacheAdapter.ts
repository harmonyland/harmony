import { Collection } from "../utils/collection.ts";
import { Client } from "./client.ts";
import { connect, Redis, RedisConnectOptions } from "https://denopkg.com/keroxp/deno-redis/mod.ts";

export interface ICacheAdapter {
  client: Client
  get: (cacheName: string, key: string) => Promise<any> | any
  set: (cacheName: string, key: string, value: any) => Promise<any> | any
  delete: (cacheName: string, key: string) => Promise<boolean> | boolean
  array: (cacheName: string) => void | any[] | Promise<any[] | void>
  deleteCache: (cacheName: string) => any
}

export class DefaultCacheAdapter implements ICacheAdapter {
  client: Client
  data: {
    [name: string]: Collection<string, any>
  } = {}

  constructor(client: Client) {
    this.client = client
  }

  async get(cacheName: string, key: string) {
    const cache = this.data[cacheName]
    if (!cache) return;
    return cache.get(key)
  }

  async set(cacheName: string, key: string, value: any) {
    let cache = this.data[cacheName]
    if (!cache) {
      this.data[cacheName] = new Collection()
      cache = this.data[cacheName]
    }
    cache.set(key, value)
  }

  async delete(cacheName: string, key: string) {
    const cache = this.data[cacheName]
    if (!cache) return false
    return cache.delete(key)
  }

  async array(cacheName: string) {
    const cache = this.data[cacheName]
    if (!cache) return []
    return cache.array()
  }

  async deleteCache(cacheName: string) {
    return delete this.data[cacheName]
  }
}

export class RedisCacheAdapter implements ICacheAdapter {
  client: Client
  _redis: Promise<Redis>
  redis?: Redis
  ready: boolean = false

  constructor(client: Client, options: RedisConnectOptions) {
    this.client = client
    this._redis = connect(options)
    this._redis.then(redis => {
      this.redis = redis
      this.ready = true
    })
  }

  async _checkReady() {
    if(!this.ready) return await this._redis;
    else return;
  }

  async get(cacheName: string, key: string) {
    await this._checkReady()
    let cache = await this.redis?.hget(cacheName, key)
    if(!cache) return
    try {
      return JSON.parse(cache as string)
    } catch(e) { return cache }
  }

  async set(cacheName: string, key: string, value: any) {
    await this._checkReady()
    return await this.redis?.hset(cacheName, key, typeof value === "object" ? JSON.stringify(value) : value)
  }

  async delete(cacheName: string, key: string) {
    await this._checkReady()
    let exists = await this.redis?.hexists(cacheName, key)
    if(!exists) return false
    await this.redis?.hdel(cacheName, key)
    return true
  }

  async array(cacheName: string) {
    await this._checkReady()
    let data = await this.redis?.hvals(cacheName)
    return data?.map((e: string) => JSON.parse(e))
  }

  async deleteCache(cacheName: string) {
    await this._checkReady()
    return await this.redis?.del(cacheName)
  }
}