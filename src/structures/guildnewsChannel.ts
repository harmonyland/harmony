import { Client } from '../models/client.ts'
import { GuildNewsChannelPayload, Overwrite } from '../types/channelTypes.ts'
import { TextChannel } from './textChannel.ts'

export class NewsChannel extends TextChannel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  parentID?: string
  topic?: string

  constructor (client: Client, data: GuildNewsChannelPayload) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
    this.topic = data.topic
  }

  protected readFromData (data: GuildNewsChannelPayload): void {
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
}
