import type { Client } from '../client/mod.ts'
import { Guild } from '../structures/guild.ts'
import { MessageSticker } from '../structures/messageSticker.ts'
import {
  CreateGuildStickerOptions,
  MessageStickerPayload
} from '../types/channel.ts'
import { BaseManager } from './base.ts'

export class GuildStickersManager extends BaseManager<
  MessageStickerPayload,
  MessageSticker
> {
  constructor(client: Client, public guild: Guild) {
    super(client, `guild_stickers:${guild.id}`, MessageSticker)
  }

  /** Fetches Guild Sticker from API */
  async fetch(id: string): Promise<MessageSticker> {
    return await new Promise((resolve, reject) => {
      this.client.rest.endpoints
        .getGuildSticker(this.guild.id, id)
        .then(async (data) => {
          await this.set(id, data)
          resolve(new MessageSticker(this.client, data))
        })
        .catch((e) => reject(e))
    })
  }

  /** Delete a Guild Sticker */
  async delete(id: string | MessageSticker, reason?: string): Promise<boolean> {
    return this.client.rest.endpoints
      .deleteGuildSticker(
        this.guild.id,
        typeof id === 'string' ? id : id.id,
        reason
      )
      .then(() => true)
  }

  /** Fetches all Guild Stickers from API (and caches them) */
  async fetchAll(): Promise<MessageSticker[]> {
    const stickers = await this.client.rest.endpoints.getGuildStickers(
      this.guild.id
    )
    await this.flush()
    const result = []
    for (const raw of stickers) {
      await this.set(raw.id, raw)
      result.push(new MessageSticker(this.client, raw))
    }
    return result
  }

  /** Creates a new Guild Sticker */
  async create(options: CreateGuildStickerOptions): Promise<MessageSticker> {
    const data = await this.client.rest.endpoints.createGuildSticker(
      this.guild.id,
      options
    )
    await this.set(data.id, data)
    return new MessageSticker(this.client, data)
  }

  async fromPayload(stickers: MessageStickerPayload[]): Promise<void> {
    for (const sticker of stickers) {
      await this.set(sticker.id, sticker)
    }
  }
}
