import { Client } from '../models/client.ts'
import { GuildChannel } from './guildChannel.ts'
import { ChannelPayload } from '../types/channelTypes.ts'
import { User } from './user.ts'

export class TextChannel extends GuildChannel implements ChannelPayload {
  id: string
  type: number
  guild_id?: string | undefined
  position?: number | undefined
  approximate_member_count?: any
  name?: string | undefined
  topic?: string | undefined
  nsfw?: boolean | undefined
  last_message_id?: string | undefined
  bitrate?: number | undefined
  user_limit?: number | undefined
  rate_limit_per_user?: number | undefined
  recipients?: User
  icon?: string | undefined
  owner_id?: string | undefined
  application_id?: string | undefined
  parent_id?: string | undefined
  last_pin_timestamp?: string | undefined


  get mention () {
    return `<#${this.id}>`
  }

  constructor (client: Client, data: ChannelPayload) {
    super(client, data)
    this.id = data.id
    this.type = data.type
  }
}
