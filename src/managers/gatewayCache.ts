import { Client } from '../models/client.ts'

export class GatewayCache {
  client: Client
  cacheName: string = 'discord_gateway_cache'

  constructor (client: Client, cacheName?: string) {
    this.client = client
    if (cacheName !== undefined) this.cacheName = cacheName
  }

  async get (key: string): Promise<undefined | any> {
    const result = await this.client.cache.get(this.cacheName, key)
    return result
  }

  async set (key: string, value: any): Promise<any> {
    const result = await this.client.cache.set(this.cacheName, key, value)
    return result
  }

  async delete (key: string): Promise<boolean> {
    const result = await this.client.cache.delete(this.cacheName, key)
    return result
  }
}
