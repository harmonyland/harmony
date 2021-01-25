import { Client } from '../models/client.ts'
import { ChannelPayload, ChannelTypes } from '../types/channel.ts'
import { SnowflakeBase } from './base.ts'

export class Channel extends SnowflakeBase {
  type: ChannelTypes
  id: string
  static cacheName = 'channel'
  get mention(): string {
    return `<#${this.id}>`
  }

  constructor(client: Client, data: ChannelPayload) {
    super(client, data)
    this.type = data.type
    this.id = data.id
  }

  readFromData(data: ChannelPayload): void {
    this.type = data.type ?? this.type
    this.id = data.id ?? this.id
  }
}
