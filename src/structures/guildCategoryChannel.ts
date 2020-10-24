import { Client } from '../models/client.ts'
import { Channel } from './channel.ts'
import {
  GuildChannelCategoryPayload,
  Overwrite
} from '../types/channelTypes.ts'

export class CategoryChannel extends Channel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  parentID?: string

  constructor (client: Client, data: GuildChannelCategoryPayload) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
  }
}
