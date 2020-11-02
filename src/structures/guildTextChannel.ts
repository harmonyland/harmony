import { Client } from '../models/client.ts'
import { GuildTextChannelPayload, Overwrite } from '../types/channel.ts'
import { TextChannel } from './textChannel.ts'

export class GuildTextChannel extends TextChannel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  parentID?: string
  rateLimit: number
  topic?: string

  get mention (): string {
    return `<#${this.id}>`
  }

  constructor (client: Client, data: GuildTextChannelPayload) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
    this.topic = data.topic
    this.rateLimit = data.rate_limit_per_user
    // TODO: Cache in Gateway Event Code
    // cache.set('guildtextchannel', this.id, this)
  }

  protected readFromData (data: GuildTextChannelPayload): void {
    super.readFromData(data)
    this.guildID = data.guild_id ?? this.guildID
    this.name = data.name ?? this.name
    this.position = data.position ?? this.position
    this.permissionOverwrites =
      data.permission_overwrites ?? this.permissionOverwrites
    this.nsfw = data.nsfw ?? this.nsfw
    this.parentID = data.parent_id ?? this.parentID
    this.topic = data.topic ?? this.topic
    this.rateLimit = data.rate_limit_per_user ?? this.rateLimit
  }
}
