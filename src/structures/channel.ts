import cache from '../models/cache.ts'
import { Client } from '../models/client.ts'
import { ChannelPayload, ChannelTypes } from '../types/channelTypes.ts'
import { Base } from './base.ts'

export class Channel extends Base {
  type: ChannelTypes
  id: string
  static cacheName = 'channel'
  get mention (): string {
    return `<#${this.id}>`
  }

  constructor (client: Client, data: ChannelPayload) {
    super(client, data)
    this.type = data.type
    this.id = data.id
    // TODO: Cache in Gateway Event Code
    // this.client.channels.set(this.id, data)
  }

  protected readFromData (data: ChannelPayload): void {
    super.readFromData(data)
    this.type = data.type ?? this.type
    this.id = data.id ?? this.id
  }
}
