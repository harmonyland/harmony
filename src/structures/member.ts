import { Client } from '../models/client.ts'
import { MemberPayload } from '../types/guildTypes.ts'
import { UserPayload } from '../types/userTypes.ts'
import { Base } from './base.ts'
import { Guild } from './guild.ts'
import { Role } from './role.ts'
import { User } from './user.ts'

export class Member extends Base implements MemberPayload {
  user: User
  nick: string | undefined
  roles: Role[]
  joined_at: string
  premium_since?: string | undefined
  deaf: boolean
  mute: boolean

  constructor (client: Client, data: MemberPayload) {
    super(client)
    this.user = data.user
    this.nick = data.nick
    this.roles = data.roles
    this.joined_at = data.joined_at
    this.premium_since = data.premium_since
    this.deaf = data.deaf
    this.mute = data.mute
  }
}
