import { Client } from '../models/client.ts'
import { UserPayload } from '../types/userTypes.ts'
import { Base } from './base.ts'
import * as cache from '../models/cache.ts'
import { USER } from '../types/endpoint.ts'

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
    this.mfaEnabled = data.mfa_enabled
    this.locale = data.locale
    this.verified = data.verified
    this.email = data.email
    this.flags = data.flags
    this.premiumType = data.premium_type
    this.publicFlags = data.public_flags
  }

  static async autoInit (client: Client, userID: string) {
    // user? users?
    const cached = cache.get('user', userID)
    if (cached === undefined || !(cached instanceof User)) {
      const resp = await fetch(USER(userID), {
        headers: {
          Authorization: `Bot ${client.token}`
        }
      })
      const userParsed: UserPayload = await resp.json()

      const newUser = new User(client, userParsed)
      cached.set('user', userID, newUser)
      return newUser
    } else {
      return cached
    }
  }
}
