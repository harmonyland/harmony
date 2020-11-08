import { Client } from '../models/client.ts'
import { Emoji } from '../structures/emoji.ts'
import { EmojiPayload } from '../types/emoji.ts'
import { GUILD_EMOJI } from '../types/endpoint.ts'
import { BaseManager } from './base.ts'

export class EmojisManager extends BaseManager<EmojiPayload, Emoji> {

  constructor (client: Client) {
    super(client, `emojis`, Emoji)
  }

  async fetch (guildID: string, id: string): Promise<Emoji> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD_EMOJI(guildID, id))
        .then(async data => {
          await this.set(id, data as EmojiPayload)
          resolve(new Emoji(this.client, data as EmojiPayload))
        })
        .catch(e => reject(e))
    })
  }
}
