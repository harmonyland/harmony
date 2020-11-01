import { Client } from "../models/client.ts";

export class GatewayCache {
    client: Client
    cacheName: string = "discord_gateway_cache"
    
    constructor(client: Client, cacheName?: string) {
        this.client = client
        if(cacheName) this.cacheName = cacheName
    }

    get(key: string) {
        return this.client.cache.get(this.cacheName, key)
    }

    set(key: string, value: any) {
        return this.client.cache.set(this.cacheName, key, value)
    }

    delete(key: string) {
        console.log(`[GatewayCache] DEL ${key}`)
        return this.client.cache.delete(this.cacheName, key)
    }
}