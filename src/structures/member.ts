import { Client } from '../models/client.ts'
import { MemberPayload } from '../types/guild.ts'
import { Base } from './base.ts'
import { Role } from "./role.ts"
import { User } from './user.ts'

export class Member extends Base {
  id: string
  user: User
  nick?: string
  roleIDs: string[]
  roles: Role[] = []
  joinedAt: string
  premiumSince?: string
  deaf: boolean
  mute: boolean

  constructor (client: Client, data: MemberPayload, user: User) {
    super(client)
    this.id = data.user.id
    this.user = user
    // this.user =
    //   cache.get('user', data.user.id) ?? new User(this.client, data.user)
    this.nick = data.nick
    this.roleIDs = data.roles
    this.joinedAt = data.joined_at
    this.premiumSince = data.premium_since
    this.deaf = data.deaf
    this.mute = data.mute
    // TODO: Cache in Gateway Event Code
    // cache.set('member', this.id, this)
  }

  protected readFromData (data: MemberPayload): void {
    super.readFromData(data.user)
    this.nick = data.nick ?? this.nick
    this.roleIDs = data.roles ?? this.roles
    this.joinedAt = data.joined_at ?? this.joinedAt
    this.premiumSince = data.premium_since ?? this.premiumSince
    this.deaf = data.deaf ?? this.deaf
    this.mute = data.mute ?? this.mute
  }
}
