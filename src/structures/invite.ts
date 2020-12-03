import { Client } from '../models/client.ts'
import { ChannelPayload } from '../types/channel.ts'
import { GuildPayload } from '../types/guild.ts'
import { InvitePayload } from '../types/invite.ts'
import { UserPayload } from '../types/user.ts'
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

  get link(): string {
    return `https://discord.gg/${this.code}`
  }

  constructor(client: Client, data: InvitePayload) {
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

  readFromData(data: InvitePayload): void {
    this.code = data.code ?? this.code
    this.guild = data.guild ?? this.guild
    this.channel = data.channel ?? this.channel
    this.inviter = data.inviter ?? this.inviter
    this.targetUser = data.target_user ?? this.targetUser
    this.targetUserType = data.target_user_type ?? this.targetUserType
    this.approximateMemberCount =
      data.approximate_member_count ?? this.approximateMemberCount
    this.approximatePresenceCount =
      data.approximate_presence_count ?? this.approximatePresenceCount
  }
}
