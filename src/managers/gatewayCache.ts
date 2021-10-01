import type { Client } from '../client/mod.ts'

/**
 * Cache Manager used for Caching values related to Gateway connection
 *
 * In case of Redis, this will persistently cache session ID and seq for fast resumes.
 */
export class GatewayCache {
  client: Client
  cacheName: string = 'discord_gateway_cache'

  constructor(client: Client, cacheName?: string) {
    this.client = client
    if (cacheName !== undefined) this.cacheName = cacheName
  }

  async get<T>(key: string): Promise<undefined | T> {
    return this.client.cache.get<T>(this.cacheName, key)
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.client.cache.set(this.cacheName, key, value)
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.client.cache.delete(this.cacheName, key)
    return result
  }
}
