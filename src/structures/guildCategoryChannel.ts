import { Client } from '../models/client.ts'
import { Channel } from './channel.ts'
import {
  GuildCategoryChannelPayload,
  ModifyGuildCategoryChannelOption,
  ModifyGuildCategoryChannelPayload,
  Overwrite
} from '../types/channel.ts'
import { Guild } from './guild.ts'
import { CHANNEL } from '../types/endpoint.ts'

export class CategoryChannel extends Channel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  guild: Guild
  parentID?: string

  constructor(client: Client, data: GuildCategoryChannelPayload, guild: Guild) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.guild = guild
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.parentID = data.parent_id
    // TODO: Cache in Gateway Event Code
    // cache.set('guildcategorychannel', this.id, this)
  }

  readFromData(data: GuildCategoryChannelPayload): void {
    super.readFromData(data)
    this.guildID = data.guild_id ?? this.guildID
    this.name = data.name ?? this.name
    this.position = data.position ?? this.position
    this.permissionOverwrites =
      data.permission_overwrites ?? this.permissionOverwrites
    this.parentID = data.parent_id ?? this.parentID
  }

  async edit(
    options?: ModifyGuildCategoryChannelOption
  ): Promise<CategoryChannel> {
    const body: ModifyGuildCategoryChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new CategoryChannel(this.client, resp, this.guild)
  }
}
