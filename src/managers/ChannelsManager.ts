import { Client } from "../models/client.ts";
import { Channel } from "../structures/channel.ts";
import { ChannelPayload } from "../types/channel.ts";
import { CHANNEL } from "../types/endpoint.ts";
import getChannelByType from "../utils/getChannelByType.ts";
import { BaseManager } from "./BaseManager.ts";

export class ChannelsManager extends BaseManager<ChannelPayload, Channel> {
  constructor(client: Client) {
    super(client, "channels", Channel)
  }

  // Override get method as Generic
  async get<T = Channel>(key: string): Promise<T | undefined> {
    const data = await this._get(key)
    if (data === undefined) return
    let guild
    if ((data as any).guild_id !== undefined) {
      guild = await this.client.guilds.get((data as any).guild_id)
    }
    const res = getChannelByType(this.client, data, guild)
    return res as any
  }

  async array(): Promise<undefined | Channel[]> {
    const arr = await (this.client.cache.array(this.cacheName) as ChannelPayload[])
    const result: any[] = []
    for(const elem of arr) {
      let guild
      if ((elem as any).guild_id !== undefined) {
        guild = await this.client.guilds.get((elem as any).guild_id)
      }
      result.push(getChannelByType(this.client, elem, guild))
    }
    return result
  }

  async fetch(id: string): Promise<Channel> {
    return await new Promise((resolve, reject) => {
      this.client.rest.get(CHANNEL(id)).then(async data => {
        this.set(id, data as ChannelPayload)
        let guild
        if (data.guild_id !== undefined) {
          guild = await this.client.guilds.get(data.guild_id)
        }
        resolve(getChannelByType(this.client, data as ChannelPayload, guild))
      }).catch(e => reject(e))
    })
  }
}
