import type { Client } from '../client/mod.ts'
import type {
  MessageStickerFormatTypes,
  MessageStickerPayload
} from '../types/channel.ts'
import { SnowflakeBase } from './base.ts'

export class MessageSticker extends SnowflakeBase {
  id: string
  packID: string
  name: string
  description: string
  tags?: string[]
  asset: string
  previewAsset: string | null
  formatType: MessageStickerFormatTypes

  constructor(client: Client, data: MessageStickerPayload) {
    super(client)

    this.id = data.id
    this.packID = data.pack_id
    this.name = data.name
    this.description = data.description
    this.tags = data.tags !== undefined ? data.tags.split(', ') : undefined
    this.asset = data.asset
    this.previewAsset = data.preview_asset
    this.formatType = data.format_type
  }

  readFromData(data: MessageStickerPayload): void {
    this.id = data.id ?? this.id
    this.packID = data.pack_id ?? this.packID
    this.name = data.name ?? this.name
    this.description = data.description ?? this.description
    this.tags = data.tags !== undefined ? data.tags.split(', ') : this.tags
    this.asset = data.asset ?? this.asset
    this.previewAsset = data.preview_asset ?? this.previewAsset
    this.formatType = data.format_type ?? this.formatType
  }

  // TODO: Make asset url function when it's available
}
