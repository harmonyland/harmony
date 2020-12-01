import { Client } from '../models/client.ts'
import { EmojiPayload } from '../types/emoji.ts'
import { USER } from '../types/endpoint.ts'
import { Base } from './base.ts'
import { Guild } from './guild.ts'
import { User } from './user.ts'

export class Emoji extends Base {
  id: string
  name: string
  roles?: string[]
  user?: User
  guild?: Guild
  requireColons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean

  get getEmojiString(): string {
    if (this.animated === false) {
      return `<:${this.name}:${this.id}>`
    } else return `<a:${this.name}:${this.id}>`
  }

  toString(): string {
    return this.getEmojiString
  }

  constructor(client: Client, data: EmojiPayload) {
    super(client, data)
    this.id = data.id
    this.name = data.name
    if (data.user !== undefined) this.user = new User(this.client, data.user)
    this.roles = data.roles
    this.requireColons = data.require_colons
    this.managed = data.managed
    this.animated = data.animated
    this.available = data.available
  }

  protected readFromData(data: EmojiPayload): void {
    super.readFromData(data)
    this.id = data.id ?? this.id
    this.name = data.name ?? this.name
    this.roles = data.roles ?? this.roles
    this.requireColons = data.require_colons ?? this.requireColons
    this.managed = data.managed ?? this.managed
    this.animated = data.animated ?? this.animated
    this.available = data.available ?? this.available
    if (data.user !== undefined && data.user.id !== this.user?.id) {
      User.autoInit(this.client, {
        endpoint: USER,
        restURLfuncArgs: [data.user.id],
      }).then((user) => (this.user = user))
    }
  }
}
