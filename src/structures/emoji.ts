import { Client } from '../models/client.ts'
import { EmojiPayload } from '../types/emojiTypes.ts'
import { Base } from './base.ts'
import { User } from './user.ts'

export class Emoji extends Base implements EmojiPayload {
  id: string
  name: string
  roles?: []
  user?: User
  require_colons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean
  constructor (client: Client, data: EmojiPayload) {
    super(client)
    this.id = data.id
    this.name = data.name
    this.roles = data.roles
    this.user = data.user
    this.require_colons = data.require_colons
    this.managed = data.managed
    this.animated = data.animated
    this.available = data.available
  }
}
