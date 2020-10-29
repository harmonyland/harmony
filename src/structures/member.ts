import cache from '../models/cache.ts'
import { Client } from '../models/client.ts'
import { MemberPayload } from '../types/guildTypes.ts'
import { User } from './user.ts'

export class Member extends User {
  nick?: string
  roles: string[]
  joinedAt: string
  premiumSince?: string
  deaf: boolean
  mute: boolean

  constructor (client: Client, data: MemberPayload) {
    super(client, data.user)
    this.nick = data.nick
    this.roles = data.roles
    this.joinedAt = data.joined_at
    this.premiumSince = data.premium_since
    this.deaf = data.deaf
    this.mute = data.mute
    cache.set('member', this.id, this)
  }

  readFromData (data: MemberPayload): void {
    super.readFromData(data)
    this.nick = data.nick ?? this.nick
    this.roles = data.roles ?? this.roles
    this.joinedAt = data.joined_at ?? this.joinedAt
    this.premiumSince = data.premium_since ?? this.premiumSince
    this.deaf = data.deaf ?? this.deaf
    this.mute = data.mute ?? this.mute
  }
}
