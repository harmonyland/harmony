import { Client } from '../models/client.ts'
import { ChannelPayload } from '../types/channelTypes.ts'
import { GuildPayload } from '../types/guildTypes.ts'
import { InvitePayload } from '../types/inviteTypes.ts'
import { UserPayload } from '../types/userTypes.ts'
import { Base } from './base.ts'

export class Invite extends Base {
  code: string
  guild?: GuildPayload
  channel: ChannelPayload
  inviter?: UserPayload
  targetUser?: UserPayload
  targetUserType?: number
  approximatePresenceCount?: number
  approximateMemberCount?: number

  get link () {
    return `https://discord.gg/${this.code}`
  }

  constructor (client: Client, data: InvitePayload) {
    super(client)
    this.code = data.code
    this.guild = data.guild
    this.channel = data.channel
    this.inviter = data.inviter
    this.targetUser = data.target_user
    this.targetUserType = data.target_user_type
    this.approximateMemberCount = data.approximate_member_count
    this.approximatePresenceCount = data.approximate_presence_count
  }
}
