import type { Client } from '../client/mod.ts'
import type {
  MessageStickerFormatTypes,
  MessageStickerItemPayload
} from '../types/channel.ts'
import { SnowflakeBase } from './base.ts'

export class MessageStickerItem extends SnowflakeBase {
  id: string
  name: string
  formatType: MessageStickerFormatTypes

  constructor(client: Client, data: MessageStickerItemPayload) {
    super(client)

    this.id = data.id
    this.name = data.name
    this.formatType = data.format_type
  }

  readFromData(data: MessageStickerItemPayload): void {
    this.id = data.id ?? this.id
    this.name = data.name ?? this.name
    this.formatType = data.format_type ?? this.formatType
  }
}
