import { Client } from '../models/client.ts'
import { Emoji } from '../structures/emoji.ts'
import { Guild } from '../structures/guild.ts'
import { EmojiPayload } from '../types/emoji.ts'
import { GUILD_EMOJI } from '../types/endpoint.ts'
import { BaseManager } from './base.ts'

export class EmojisManager extends BaseManager<EmojiPayload, Emoji> {
  guild: Guild

  constructor (client: Client, guild: Guild) {
    super(client, `emojis:${guild.id}`, Emoji)
    this.guild = guild
  }

  async fetch (id: string): Promise<Emoji> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD_EMOJI(this.guild.id, id))
        .then(data => {
          this.set(id, data as EmojiPayload)
          resolve(new Emoji(this.client, data as EmojiPayload))
        })
        .catch(e => reject(e))
    })
  }
}
