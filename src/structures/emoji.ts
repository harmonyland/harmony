import { Client } from '../models/client.ts'
import { EmojiPayload } from '../types/emojiTypes.ts'
import { Base } from './base.ts'
import { User } from './user.ts'

export class Emoji extends Base {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private data: EmojiPayload
  client: Client
  id: string
  name: string
  roles?: []

  get user (): User | undefined {
    if (this.data.user !== undefined) {
      return new User(this.client, this.data.user)
    }
  }

  requireColons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean

  get getEmojiString (): string {
    if (this.animated === false) {
      return `<:${this.name}:${this.id}>`
    } else return `<a:${this.name}:${this.id}>`
  }

  constructor (client: Client, data: EmojiPayload) {
    super(client, data)
    this.data = data
    this.client = client
    this.id = data.id
    this.name = data.name
    this.roles = data.roles
    this.requireColons = data.require_colons
    this.managed = data.managed
    this.animated = data.animated
    this.available = data.available
  }
}
