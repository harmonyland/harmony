import type { Client } from '../client/mod.ts'
import type { ImageSize } from '../types/cdn.ts'
import type { EmojiPayload } from '../types/emoji.ts'
import { CUSTOM_EMOJI, EMOJI } from '../types/endpoint.ts'
import { Snowflake } from '../utils/snowflake.ts'
import { Base } from './base.ts'
import { ImageURL } from './cdn.ts'
import type { Guild } from './guild.ts'
import { Role } from './role.ts'
import { User } from './user.ts'

/** Guild Emoji Object */
export class Emoji extends Base {
  id!: string | null

  get snowflake(): Snowflake | null {
    return this.id === null ? null : new Snowflake(this.id)
  }

  get timestamp(): Date | null {
    return this.snowflake === null ? null : new Date(this.snowflake.timestamp)
  }

  name!: string | null
  roles?: string[]
  user?: User
  guild?: Guild
  requireColons?: boolean
  managed?: boolean
  animated?: boolean
  available?: boolean

  get getEmojiString(): string {
    if (this.id === null) {
      return this.name as string
    } else {
      if (this.animated === false) {
        return `<:${this.name}:${this.id}>`
      } else return `<a:${this.name}:${this.id}>`
    }
  }

  toString(): string {
    return this.getEmojiString
  }

  constructor(client: Client, data: EmojiPayload) {
    super(client, data)
    this.readFromData(data)
  }

  /**
   * Gets emoji image URL
   */
  emojiImageURL(
    format: 'png' | 'gif' | 'dynamic' = 'png',
    size: ImageSize = 512
  ): string | undefined {
    return this.id != null
      ? `${ImageURL(CUSTOM_EMOJI(this.id), format, size)}`
      : undefined
  }

  /** Modify the given emoji. Requires the MANAGE_EMOJIS permission. Returns the updated emoji object on success. Fires a Guild Emojis Update Gateway event. */
  async edit(data: ModifyGuildEmojiParams): Promise<Emoji> {
    if (this.id === null) throw new Error('Emoji ID is not valid.')
    if (this.guild === undefined) throw new Error('Guild is undefined')
    const roles = Array.isArray(data.roles)
      ? data.roles.map((role) => (role instanceof Role ? role.id : role))
      : [data.roles instanceof Role ? data.roles.id : data.roles]
    const res = await this.client.rest.patch(EMOJI(this.guild.id, this.id), {
      ...data,
      roles
    })
    return new Emoji(this.client, res)
  }

  /** Delete the given emoji. Requires the MANAGE_EMOJIS permission. Returns `true` on success. Fires a Guild Emojis Update Gateway event. */
  async delete(): Promise<boolean> {
    if (this.id === null) return false
    if (this.guild === undefined) return false
    await this.client.rest.delete(EMOJI(this.guild.id, this.id))
    return true
  }

  readFromData(data: EmojiPayload): void {
    this.id = data.id ?? this.id
    this.name = data.name ?? this.name
    this.roles = data.roles ?? this.roles
    this.requireColons = data.require_colons ?? this.requireColons
    this.managed = data.managed ?? this.managed
    this.animated = data.animated ?? this.animated
    this.available = data.available ?? this.available
    if (data.user !== undefined) this.user = new User(this.client, data.user)
  }
}

/** https://discord.com/developers/docs/resources/emoji#modify-guild-emoji-json-params */
export interface ModifyGuildEmojiParams {
  /** Name of the emoji */
  name?: string
  /** Roles to which this emoji will be whitelisted */
  roles?: string | Role | Array<string | Role>
}
