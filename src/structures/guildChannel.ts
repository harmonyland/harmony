import { Client } from '../models/client.ts'
import { GuildChannelPayload, Overwrite } from '../types/channelTypes.ts'
import { Channel } from './channel.ts'

export class GuildChannel extends Channel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  parentID?: string

  constructor (client: Client, data: GuildChannelPayload) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
  }
}
