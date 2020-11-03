import { Client } from "../models/client.ts";
import { Channel } from "../structures/channel.ts";
import { User } from "../structures/user.ts";
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
    let data = await this._get(key) as any
    if(!data) return
    let guild
    if(data.guild_id) {
      guild = await this.client.guilds.get(data.guild_id)
    }
    let res = getChannelByType(this.client, data as ChannelPayload, guild || undefined)
    return res as any
  }

  async array(): Promise<void | Channel[]> {
    let arr = await (this.client.cache.array(this.cacheName) as ChannelPayload[])
    let result: any[] = []
    for(let elem of arr) {
      let guild
      if((elem as any).guild_id) {
        guild = await this.client.guilds.get((elem as any).guild_id)
      }
      result.push(getChannelByType(this.client, elem as ChannelPayload, guild || undefined))
    }
    return result
  }

  fetch(id: string): Promise<Channel> {
    return new Promise((res, rej) => {
      this.client.rest.get(CHANNEL(id)).then(async data => {
        this.set(id, data as ChannelPayload)
        let guild
        if((data as any).guild_id) {
          guild = await this.client.guilds.get((data as any).guild_id)
        }
        res(getChannelByType(this.client, data as ChannelPayload, guild || undefined))
      }).catch(e => rej(e))
    })
  }
}
