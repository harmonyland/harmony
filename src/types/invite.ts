import { Channel } from '../structures/channel.ts'
import { Guild } from '../structures/guild.ts'
import { ChannelPayload } from './channel.ts'
import { GuildPayload } from './guild.ts'
import { UserPayload } from './user.ts'

export interface InvitePayload {
  code: string
  guild?: GuildPayload
  channel: ChannelPayload
  inviter?: UserPayload
  target_user?: UserPayload
  target_user_type?: number
  approximate_presence_count?: number
  approximate_member_count?: number
}

export interface PartialInvitePayload {
  code: string
  channel: Channel
  guild?: Guild
}
