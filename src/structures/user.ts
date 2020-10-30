import cache from '../models/cache.ts'
import { Client } from '../models/client.ts'
import { UserPayload } from '../types/userTypes.ts'
import { Base } from './base.ts'

export class User extends Base {
  id: string
  username: string
  discriminator: string
  avatar?: string
  bot?: boolean
  system?: boolean
  mfaEnabled?: boolean
  locale?: string
  verified?: boolean
  email?: string
  flags?: number
  premiumType?: 0 | 1 | 2
  publicFlags?: number

  get nickMention (): string {
    return `<@!${this.id}>`
  }

  get mention (): string {
    return `<@${this.id}>`
  }

  constructor (client: Client, data: UserPayload) {
    super(client, data)
    this.id = data.id
    this.username = data.username
    this.discriminator = data.discriminator
    this.avatar = data.avatar
    this.bot = data.bot
    this.system = data.system
    this.mfaEnabled = data.mfa_enabled
    this.locale = data.locale
    this.verified = data.verified
    this.email = data.email
    this.flags = data.flags
    this.premiumType = data.premium_type
    this.publicFlags = data.public_flags
    cache.set('user', this.id, this)
  }

  protected readFromData (data: UserPayload): void {
    super.readFromData(data)
    this.username = data.username ?? this.username
    this.discriminator = data.discriminator ?? this.discriminator
    this.avatar = data.avatar ?? this.avatar
    this.bot = data.bot ?? this.bot
    this.system = data.system ?? this.system
    this.mfaEnabled = data.mfa_enabled ?? this.mfaEnabled
    this.locale = data.locale ?? this.locale
    this.verified = data.verified ?? this.verified
    this.email = data.email ?? this.email
    this.flags = data.flags ?? this.flags
    this.premiumType = data.premium_type ?? this.premiumType
    this.publicFlags = data.public_flags ?? this.publicFlags
  }
}
