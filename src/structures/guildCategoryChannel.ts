import { Client } from '../models/client.ts'
import { Channel } from './channel.ts'
import { GuildChannelCategoryPayload, Overwrite } from '../types/channel.ts'
import { Guild } from './guild.ts'

export class CategoryChannel extends Channel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  guild: Guild
  parentID?: string

  constructor(client: Client, data: GuildChannelCategoryPayload, guild: Guild) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.guild = guild
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
    // TODO: Cache in Gateway Event Code
    // cache.set('guildcategorychannel', this.id, this)
  }

  readFromData(data: GuildChannelCategoryPayload): void {
    super.readFromData(data)
    this.guildID = data.guild_id ?? this.guildID
    this.name = data.name ?? this.name
    this.position = data.position ?? this.position
    this.permissionOverwrites =
      data.permission_overwrites ?? this.permissionOverwrites
    this.nsfw = data.nsfw ?? this.nsfw
    this.parentID = data.parent_id ?? this.parentID
  }
}
