import { Client } from '../models/client.ts'
import { MemberPayload } from '../types/guildTypes.ts'
import { RolePayload } from '../types/roleTypes.ts'
import { UserPayload } from '../types/userTypes.ts'
import { Base } from './base.ts'
import { Guild } from './guild.ts'
import { Role } from './role.ts'
import { User } from './user.ts'

export class Member extends Base {
  user: UserPayload
  nick?: string
  roles: RolePayload[]
  joinedAt: string
  premiumSince?: string
  deaf: boolean
  mute: boolean

  constructor (client: Client, data: MemberPayload) {
    super(client)
    this.user = data.user
    this.nick = data.nick
    this.roles = data.roles
    this.joinedAt = data.joined_at
    this.premiumSince = data.premium_since
    this.deaf = data.deaf
    this.mute = data.mute
  }
}
