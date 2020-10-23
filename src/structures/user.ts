import { Client } from '../models/client.ts'
import { UserPayload } from '../types/userTypes.ts'
import { Base } from './base.ts'

export class User extends Base implements UserPayload {
  id: string
  username: string
  discriminator: string
  avatar?: string
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  locale?: string
  verified?: boolean
  email?: string
  flags?: number
  premium_type?: 0 | 1 | 2
  public_flags?: number

  get nickMention () {
    return `<@!${this.id}>`
  }

  get mention () {
    return `<@${this.id}>`
  }

  constructor (client: Client, data: UserPayload) {
    super(client)
    this.id = data.id
    this.username = data.username
    this.discriminator = data.discriminator
    this.avatar = data.avatar
    this.bot = data.bot
    this.system = data.system
    this.mfa_enabled = data.mfa_enabled
    this.locale = data.locale
    this.verified = data.verified
    this.email = data.email
    this.flags = data.flags
    this.premium_type = data.premium_type
    this.public_flags = data.public_flags
  }
}
