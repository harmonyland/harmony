import { Client } from '../models/client.ts'
import { Emoji } from '../structures/emoji.ts'
import { Guild } from '../structures/guild.ts'
import { Message } from '../structures/message.ts'
import { MessageReaction } from '../structures/messageReaction.ts'
import { User } from '../structures/user.ts'
import { Reaction } from '../types/channel.ts'
import {
  MESSAGE_REACTION,
  MESSAGE_REACTIONS,
  MESSAGE_REACTION_USER
} from '../types/endpoint.ts'
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

    const emojiID = raw.emoji.id !== null ? raw.emoji.id : raw.emoji.name

    let emoji = await this.client.emojis.get(emojiID as string)
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

  async array(): Promise<MessageReaction[]> {
    let arr = await (this.client.cache.array(this.cacheName) as Reaction[])
    if (arr === undefined) arr = []

    return await Promise.all(
      arr.map(async (raw) => {
        const emojiID = raw.emoji.id !== null ? raw.emoji.id : raw.emoji.name
        let emoji = await this.client.emojis.get(emojiID as string)
        if (emoji === undefined) emoji = new Emoji(this.client, raw.emoji)

        return new MessageReaction(this.client, raw, this.message, emoji)
      })
    )
  }

  async flush(): Promise<any> {
    await this.client.cache.deleteCache(`reaction_users:${this.message.id}`)
    return this.client.cache.deleteCache(this.cacheName)
  }

  /** Remove all Reactions from the Message */
  async removeAll(): Promise<void> {
    await this.client.rest.delete(
      MESSAGE_REACTIONS(this.message.channel.id, this.message.id)
    )
  }

  /** Remove a specific Emoji from Reactions */
  async removeEmoji(emoji: Emoji | string): Promise<MessageReactionsManager> {
    const val = encodeURIComponent(
      (typeof emoji === 'object' ? emoji.id ?? emoji.name : emoji) as string
    )
    await this.client.rest.delete(
      MESSAGE_REACTION(this.message.channel.id, this.message.id, val)
    )
    return this
  }

  /** Remove a specific Emoji from Reactions */
  async removeUser(
    emoji: Emoji | string,
    user: User | string
  ): Promise<MessageReactionsManager> {
    const val = encodeURIComponent(
      (typeof emoji === 'object' ? emoji.id ?? emoji.name : emoji) as string
    )
    await this.client.rest.delete(
      MESSAGE_REACTION_USER(
        this.message.channel.id,
        this.message.id,
        val,
        typeof user === 'string' ? user : user.id
      )
    )
    return this
  }
}
