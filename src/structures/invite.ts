import { Client } from '../models/client.ts'
import { Channel } from '../structures/channel.ts'
import { Guild } from '../structures/guild.ts'
import { User } from '../structures/user.ts'
import { InvitePayload } from '../types/inviteTypes.ts'
import { Base } from './base.ts'

export class Invite extends Base implements InvitePayload {
  code: string
  guild?: Guild
  channel: Channel
  inviter?: User
  target_user?: User
  target_user_type?: number
  approximate_presence_count?: number
  approximate_member_count?: number

  constructor (client: Client, data: InvitePayload) {
    super(client)
    this.code = data.code
    this.guild = data.guild
    this.channel = data.channel
    this.inviter = data.inviter
    this.target_user = data.target_user
    this.target_user_type = data.target_user_type
    this.approximate_member_count = data.approximate_member_count
    this.approximate_presence_count = data.approximate_presence_count
  }
}
