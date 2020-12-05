import { Client } from '../models/client.ts'
import { Channel } from '../structures/channel.ts'
import { ChannelPayload, GuildChannelPayload } from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import getChannelByType from '../utils/getChannelByType.ts'
import { BaseManager } from './base.ts'

export class ChannelsManager extends BaseManager<ChannelPayload, Channel> {
  constructor(client: Client) {
    super(client, 'channels', Channel)
  }

  // Override get method as Generic
  async get<T = Channel>(key: string): Promise<T | undefined> {
    const data = await this._get(key)
    if (data === undefined) return
    let guild
    if ('guild_id' in data) {
      guild = await this.client.guilds.get(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        (data as GuildChannelPayload).guild_id
      )
    }
    const res = getChannelByType(this.client, data, guild)
    return res as any
  }

  async array(): Promise<undefined | Channel[]> {
    const arr = await (this.client.cache.array(
      this.cacheName
    ) as ChannelPayload[])
    const result: any[] = []
    for (const elem of arr) {
      let guild
      if ('guild_id' in elem) {
        guild = await this.client.guilds.get(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          (elem as GuildChannelPayload).guild_id
        )
      }
      result.push(getChannelByType(this.client, elem, guild))
    }
    return result
  }

  /** Fetches a Channel by ID, cache it, resolve it */
  async fetch<T = Channel>(id: string): Promise<T> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(CHANNEL(id))
        .then(async (data) => {
          this.set(id, data as ChannelPayload)
          let guild
          if (data.guild_id !== undefined) {
            guild = await this.client.guilds.get(data.guild_id)
          }
          resolve(
            (getChannelByType(
              this.client,
              data as ChannelPayload,
              guild
            ) as unknown) as T
          )
        })
        .catch((e) => reject(e))
    })
  }
}
