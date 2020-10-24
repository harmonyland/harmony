import { Client } from '../models/client.ts'
import { GuildChannel } from './guildChannel.ts'
import { GuildTextChannelPayload } from '../types/channelTypes.ts'

export class GuildTextChannel extends GuildChannel {
  rateLimit: number
  topic?: string

  get mention () {
    return `<#${this.id}>`
  }

  constructor (client: Client, data: GuildTextChannelPayload) {
    super(client, data)
    this.topic = data.topic
    this.rateLimit = data.rate_limit_per_user
  }
}
