import cache from '../models/cache.ts'
import { Client } from '../models/client.ts'
import { GuildVoiceChannelPayload, Overwrite } from '../types/channelTypes.ts'
import { Channel } from './channel.ts'

export class VoiceChannel extends Channel {
  bitrate: string
  userLimit: number
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  parentID?: string

  constructor (client: Client, data: GuildVoiceChannelPayload) {
    super(client, data)
    this.bitrate = data.bitrate
    this.userLimit = data.user_limit
    this.guildID = data.guild_id
    this.name = data.name
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
    // TODO: Cache in Gateway Event Code
    // cache.set('guildvoicechannel', this.id, this)
  }

  protected readFromData (data: GuildVoiceChannelPayload): void {
    super.readFromData(data)
    this.bitrate = data.bitrate ?? this.bitrate
    this.userLimit = data.user_limit ?? this.userLimit
    this.guildID = data.guild_id ?? this.guildID
    this.name = data.name ?? this.name
    this.position = data.position ?? this.position
    this.permissionOverwrites =
      data.permission_overwrites ?? this.permissionOverwrites
    this.nsfw = data.nsfw ?? this.nsfw
    this.parentID = data.parent_id ?? this.parentID
  }
}
