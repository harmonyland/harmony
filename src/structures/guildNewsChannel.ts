import { Client } from '../models/client.ts'
import {
  GuildNewsChannelPayload,
  ModifyGuildNewsChannelOption,
  ModifyGuildNewsChannelPayload,
  Overwrite
} from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { Guild } from './guild.ts'
import { TextChannel } from './textChannel.ts'

export class NewsChannel extends TextChannel {
  guildID: string
  guild: Guild
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  parentID?: string
  topic?: string

  constructor(client: Client, data: GuildNewsChannelPayload, guild: Guild) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.guild = guild
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
    this.topic = data.topic
  }

  readFromData(data: GuildNewsChannelPayload): void {
    super.readFromData(data)
    this.guildID = data.guild_id ?? this.guildID
    this.name = data.name ?? this.name
    this.position = data.position ?? this.position
    this.permissionOverwrites =
      data.permission_overwrites ?? this.permissionOverwrites
    this.nsfw = data.nsfw ?? this.nsfw
    this.parentID = data.parent_id ?? this.parentID
    this.topic = data.topic ?? this.topic
  }

  async edit(options?: ModifyGuildNewsChannelOption): Promise<NewsChannel> {
    const body: ModifyGuildNewsChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID,
      type: options?.type,
      topic: options?.topic,
      nsfw: options?.nsfw
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new NewsChannel(this.client, resp, this.guild)
  }
}
