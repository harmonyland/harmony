import type { Client } from '../client/mod.ts'
import { Guild } from '../structures/guild.ts'
import { MessageSticker } from '../structures/messageSticker.ts'
import {
  CreateGuildStickerOptions,
  MessageStickerPayload,
  ModifyGuildStickerOptions
} from '../types/channel.ts'
import { BaseChildManager } from './baseChild.ts'

export class GuildStickersManager extends BaseChildManager<
  MessageStickerPayload,
  MessageSticker
> {
  constructor(client: Client, public guild: Guild) {
    super(client, client.stickers)
  }

  /** Fetches Guild Sticker from API */
  async fetch(id: string): Promise<MessageSticker> {
    const sticker = await this.client.stickers.fetch(id)
    if (sticker.guildID === this.guild.id)
      throw new Error(
        `This sticker (${sticker.id}) is not part of Guild ${this.guild.id}`
      )
    return sticker
  }

  /** Delete a Guild Sticker */
  async delete(id: string | MessageSticker, reason?: string): Promise<boolean> {
    return this.client.stickers.delete(this.guild, id, reason)
  }

  /** Fetches all Guild Stickers from API (and caches them) */
  async fetchAll(): Promise<MessageSticker[]> {
    return this.client.stickers.fetchAll(this.guild)
  }

  /** Creates a new Guild Sticker */
  async create(options: CreateGuildStickerOptions): Promise<MessageSticker> {
    return this.client.stickers.create(this.guild, options)
  }

  /** Edit an existing Guild Sticker */
  async edit(
    sticker: string | MessageSticker,
    options: Partial<ModifyGuildStickerOptions>
  ): Promise<MessageSticker> {
    return this.client.stickers.edit(this.guild, sticker, options)
  }

  /** Returns a list of IDs of all Stickers in this Guild */
  async keys(): Promise<string[]> {
    const keys = []
    for (const sticker of ((await this.client.cache.array('stickers')) ??
      []) as MessageStickerPayload[]) {
      if (sticker.guild_id === this.guild.id) keys.push(sticker.id)
    }
    return keys
  }

  /** Returns an Array of all Stickers in this Guild */
  async array(): Promise<MessageSticker[]> {
    const stickers = []
    for (const sticker of ((await this.client.cache.array('stickers')) ??
      []) as MessageStickerPayload[]) {
      if (sticker.guild_id === this.guild.id)
        stickers.push(new MessageSticker(this.client, sticker))
    }
    return stickers
  }

  /** Purges Guild Sticker Cache */
  async flush(): Promise<void> {
    for (const sticker of ((await this.client.cache.array('stickers')) ??
      []) as MessageStickerPayload[]) {
      if (sticker.guild_id === this.guild.id)
        await this.client.stickers._delete(sticker.id)
    }
  }
}
