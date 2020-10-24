import { Client } from '../models/client.ts'
import { EmojiPayload } from '../types/emojiTypes.ts'
import { UserPayload } from '../types/userTypes.ts'
import { Base } from './base.ts'

export class Emoji extends Base {
  id: string
  name: string
  roles?: []
  user?: UserPayload
  requireColons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean

  get CustomEmoji () {
    if (this.animated === false) {
      return `<:${this.name}:${this.id}>`
    } else return `<a:${this.name}:${this.id}>`
  }

  constructor (client: Client, data: EmojiPayload) {
    super(client)
    this.id = data.id
    this.name = data.name
    this.roles = data.roles
    this.user = data.user
    this.requireColons = data.require_colons
    this.managed = data.managed
    this.animated = data.animated
    this.available = data.available
  }
}
