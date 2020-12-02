import { Client } from '../models/client.ts'
import { Emoji } from '../structures/emoji.ts'
import { Guild } from '../structures/guild.ts'
import { Message } from '../structures/message.ts'
import { MessageReaction } from '../structures/messageReaction.ts'
import { Reaction } from '../types/channel.ts'
import { BaseManager } from './base.ts'

export class MessageReactionsManager extends BaseManager<
  Reaction,
  MessageReaction
> {
  message: Message

  constructor(client: Client, message: Message) {
    super(client, `reactions:${message.id}`, Guild)
    this.message = message
  }

  async get(id: string): Promise<MessageReaction | undefined> {
    const raw = await this._get(id)
    if (raw === undefined) return

    let emoji = await this.client.emojis.get(raw.emoji.id)
    if (emoji === undefined) emoji = new Emoji(this.client, raw.emoji)

    const reaction = new MessageReaction(this.client, raw, this.message, emoji)
    return reaction
  }

  async set(key: string, value: Reaction): Promise<any> {
    return this.client.cache.set(
      this.cacheName,
      key,
      value,
      this.client.reactionCacheLifetime
    )
  }

  async flush(): Promise<any> {
    await this.client.cache.deleteCache(`reaction_users:${this.message.id}`)
    return this.client.cache.deleteCache(this.cacheName)
  }
}
