import type { Client } from '../client/mod.ts'
import type { Guild } from '../structures/guild.ts'
import {
  MessageSticker,
  MessageStickerPack
} from '../structures/messageSticker.ts'
import type {
  CreateGuildStickerOptions,
  MessageStickerPayload,
  ModifyGuildStickerOptions
} from '../types/channel.ts'
import { BaseManager } from './base.ts'

export class StickersManager extends BaseManager<
  MessageStickerPayload,
  MessageSticker
> {
  constructor(client: Client) {
    super(client, `stickers`, MessageSticker)
  }

  /** Fetches list of Nitro Sticker Packs. These are not cached. */
  async getStickerPacks(): Promise<MessageStickerPack[]> {
    const packsRaw = await this.client.rest.endpoints.getStickerPacks()
    const packs = []
    for (const pack of packsRaw) {
      packs.push(new MessageStickerPack(this.client, pack))
    }
    return packs
  }

  /** Delete a Guild Sticker */
  async delete(
    guild: string | Guild,
    id: string | MessageSticker,
    reason?: string
  ): Promise<boolean> {
    id = typeof id === 'string' ? id : id.id
    const result = await this.client.rest.endpoints
      .deleteGuildSticker(
        typeof guild === 'string' ? guild : guild.id,
        id,
        reason
      )
      .then(() => true)
    if (result === true) await this._delete(id)
    return result
  }

  /** Fetches a Sticker */
  async fetch(sticker: MessageSticker | string): Promise<MessageSticker> {
    const data = await this.client.rest.endpoints.getSticker(
      typeof sticker === 'string' ? sticker : sticker.id
    )
    if (data.guild_id !== undefined) await this.set(data.id, data)
    return new MessageSticker(this.client, data)
  }

  /** Fetches all Guild Stickers from API (and caches them) */
  async fetchAll(guild: string | Guild): Promise<MessageSticker[]> {
    const stickers = await this.client.rest.endpoints.getGuildStickers(
      typeof guild === 'string' ? guild : guild.id
    )
    const result = []
    for (const raw of stickers) {
      await this.set(raw.id, raw)
      result.push(new MessageSticker(this.client, raw))
    }
    return result
  }

  /** Creates a new Guild Sticker */
  async create(
    guild: Guild | string,
    options: CreateGuildStickerOptions
  ): Promise<MessageSticker> {
    const data = await this.client.rest.endpoints.createGuildSticker(
      typeof guild === 'string' ? guild : guild.id,
      options
    )
    await this.set(data.id, data)
    return new MessageSticker(this.client, data)
  }

  /** Edit an existing Guild Sticker */
  async edit(
    guild: Guild | string,
    sticker: string | MessageSticker,
    options: Partial<ModifyGuildStickerOptions>
  ): Promise<MessageSticker> {
    const id = typeof sticker === 'string' ? sticker : sticker.id
    const data = await this.client.rest.endpoints.modifyGuildSticker(
      typeof guild === 'string' ? guild : guild.id,
      id,
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
