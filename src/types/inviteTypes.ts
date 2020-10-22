import { Channel } from '../structures/channel.ts'
import { Guild } from '../structures/guild.ts'
import { User } from '../structures/user.ts'

export interface InvitePayload {
  code: string
  guild?: Guild
  channel: Channel
  inviter?: User
  target_user?: User
  target_user_type?: number
  approximate_presence_count?: number
  approximate_member_count?: number
}
