import type { Client } from '../client/mod.ts'
import type {
  MessageStickerFormatTypes,
  MessageStickerItemPayload,
  MessageStickerPayload,
  MessageStickerType
} from '../types/channel.ts'
import { SnowflakeBase } from './base.ts'
import { User } from './user.ts'

export class MessageStickerItem extends SnowflakeBase {
  name!: string
  formatType!: MessageStickerFormatTypes

  constructor(client: Client, data: MessageStickerItemPayload) {
    super(client)
    this.readFromData(data)
  }

  readFromData(data: MessageStickerItemPayload): void {
    this.id = data.id ?? this.id
    this.name = data.name ?? this.name
    this.formatType = data.format_type ?? this.formatType
  }
}

export class MessageSticker extends SnowflakeBase {
  name!: string
  packID?: string
  type!: MessageStickerType
  formatType!: MessageStickerFormatTypes
  description: string | null = null
  tags!: string
  available?: boolean
  guildID?: string
  user?: User
  sortValue?: number

  constructor(client: Client, data: MessageStickerPayload) {
    super(client, data)
    this.readFromData(data)
  }

  readFromData(data: MessageStickerPayload): void {
    this.name = data.name ?? this.name
    this.type = data.type ?? this.type
    this.formatType = data.format_type ?? this.formatType
    this.description = data.description ?? this.description
    this.packID = data.pack_id ?? this.packID
    this.tags = data.tags ?? this.tags
    this.available = data.available ?? this.available
    this.guildID = data.guild_id ?? this.guildID
    this.user =
      data.user === undefined ? undefined : new User(this.client, data.user)
    this.sortValue = data.sort_value ?? this.sortValue
  }
}
