import type { Client } from '../client/mod.ts'

/**
 * Cache Manager used for Caching values related to Gateway connection
 *
 * In case of Redis, this will persistently cache session ID and seq for fast resumes.
 */
export class GatewayCache {
  client: Client
  cacheName = 'discord_gateway_cache'

  constructor(client: Client, cacheName?: string) {
    this.client = client
    if (cacheName !== undefined) this.cacheName = cacheName
  }

  async get(key: string): Promise<undefined | any> {
    const result = await this.client.cache.get(this.cacheName, key)
    return result
  }

  async set(key: string, value: any): Promise<any> {
    const result = await this.client.cache.set(this.cacheName, key, value)
    return result
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.client.cache.delete(this.cacheName, key)
    return result
  }
}
