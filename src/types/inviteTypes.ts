import { ChannelPayload } from './channelTypes.ts'
import { GuildPayload } from './guildTypes.ts'
import { UserPayload } from './userTypes.ts'

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
