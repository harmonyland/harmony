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

export interface InviteMetadataPayload {
  /** number of times this invite has been used */
  uses: number
  /** max number of times this invite can be used */
  max_uses: number
  /** duration (in seconds) after which the invite expires */
  max_age: number
  /** whether this invite only grants temporary membership */
  temporary: boolean
  /** when this invite was created */
  created_at: Date
}

export interface InviteWithMetadataPayload
  extends InvitePayload,
    InviteMetadataPayload {}
