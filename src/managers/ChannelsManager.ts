import { Client } from '../models/client.ts'
import { Channel } from '../structures/channel.ts'
import { User } from '../structures/user.ts'
import { ChannelPayload } from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { BaseManager } from './BaseManager.ts'

export class ChannelsManager extends BaseManager<ChannelPayload, Channel> {
  constructor (client: Client) {
    super(client, 'channels', User)
  }

  // Override get method as Generic
  async get<T = Channel> (key: string): Promise<T> {
    return new this.DataType(this.client, this._get(key))
  }

  async fetch (id: string): Promise<Channel> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(CHANNEL(id))
        .then(data => {
          this.set(id, data as ChannelPayload)
          resolve(new Channel(this.client, data as ChannelPayload))
        })
        .catch(e => reject(e))
    })
  }
}
