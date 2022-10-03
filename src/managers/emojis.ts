import type { Guild } from '../../mod.ts'
import type { Client } from '../client/mod.ts'
import { Emoji } from '../structures/emoji.ts'
import type { EmojiPayload } from '../types/emoji.ts'
import { GUILD_EMOJI } from '../types/endpoint.ts'
import { BaseManager } from './base.ts'

export class EmojisManager extends BaseManager<EmojiPayload, Emoji> {
  constructor(client: Client) {
    super(client, `emojis`, Emoji)
  }

  async get(key: string): Promise<Emoji | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return
    const emoji = new this.DataType(this.client, raw)
    if (raw.guild_id !== undefined) {
      const guild = await this.client.guilds.get(raw.guild_id)
      if (guild !== undefined) emoji.guild = guild
    }
    return emoji
  }

  /** Fetches an Emoji by Guild ID and Emoji ID, cache it and resolve it */
  async fetch(guildID: string, id: string): Promise<Emoji> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD_EMOJI(guildID, id))
        .then(async (data) => {
          await this.set(id, data as EmojiPayload)
          resolve(new Emoji(this.client, data as EmojiPayload))
        })
        .catch((e) => reject(e))
    })
  }

  /** Try to get Emoji from cache, if not found then fetch */
  async resolve(
    key: string,
    guild?: string | Guild
  ): Promise<Emoji | undefined> {
    const cacheValue = await this.get(key)
    if (cacheValue !== undefined) return cacheValue
    else {
      if (guild !== undefined) {
        const guildID = typeof guild === 'string' ? guild : guild.id
        const fetchValue = await this.fetch(guildID, key).catch(() => undefined)
        if (fetchValue !== undefined) return fetchValue
      }
    }
  }
}
