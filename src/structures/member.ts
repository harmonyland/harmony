import { Client } from '../models/client.ts'
import { MemberPayload } from '../types/guildTypes.ts'
import { RolePayload } from '../types/roleTypes.ts'
import { UserPayload } from '../types/userTypes.ts'
import { Base } from './base.ts'
import { Guild } from './guild.ts'
import { Role } from './role.ts'
import { User } from './user.ts'

export class Member extends User {
  user: User
  nick?: string
  roles: Role[]
  joinedAt: string
  premiumSince?: string
  deaf: boolean
  mute: boolean

  constructor (client: Client, data: MemberPayload) {
    super(client, data.user)
    this.user = this
    this.nick = data.nick
    this.roles = data.roles.map(v => new Role(client, v))
    this.joinedAt = data.joined_at
    this.premiumSince = data.premium_since
    this.deaf = data.deaf
    this.mute = data.mute
  }
}
