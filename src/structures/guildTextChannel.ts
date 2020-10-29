import { Client } from '../models/client.ts'
import { GuildChannel } from './guildChannel.ts'
import { GuildTextChannelPayload } from '../types/channelTypes.ts'
import cache from '../models/cache.ts'

export class GuildTextChannel extends GuildChannel {
  rateLimit: number
  topic?: string

  get mention (): string {
    return `<#${this.id}>`
  }

  constructor (client: Client, data: GuildTextChannelPayload) {
    super(client, data)
    this.topic = data.topic
    this.rateLimit = data.rate_limit_per_user
    cache.set('guildtextchannel', this.id, this)
  }

  readFromData (data: GuildTextChannelPayload): void {
    super.readFromData(data)
    this.topic = data.topic ?? this.topic
    this.rateLimit = data.rate_limit_per_user ?? this.rateLimit
  }
}
