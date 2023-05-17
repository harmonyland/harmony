import type { Client } from '../client/mod.ts'
import { Emoji } from '../structures/emoji.ts'
import type { Message } from '../structures/message.ts'
import { MessageReaction } from '../structures/messageReaction.ts'
import type { User } from '../structures/user.ts'
import type { Reaction } from '../types/channel.ts'
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
    super(client, `reactions:${message.id}`, MessageReaction)
    this.message = message
  }

  async updateRefs(): Promise<void> {
    const newVal = await this.message.channel.messages.get(this.message.id)
    if (newVal !== undefined) {
      this.message = newVal
    }
    await this.message.updateRefs()
  }

  async get(id: string): Promise<MessageReaction | undefined> {
    const raw = await this._get(id)
    if (raw === undefined) return

    const emojiID = raw.emoji.id !== null ? raw.emoji.id : raw.emoji.name

    let emoji = await this.client.emojis.get(emojiID as string)
    if (emoji === undefined) emoji = new Emoji(this.client, raw.emoji)

    await this.updateRefs()
    const reaction = new MessageReaction(this.client, raw, this.message, emoji)
    return reaction
  }

  async set(key: string, value: Reaction): Promise<void> {
    await this.client.cache.set(
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

  async flush(): Promise<void> {
    await this.client.cache.deleteCache(`reaction_users:${this.message.id}`)
    await this.client.cache.deleteCache(this.cacheName)
  }

  /** Remove all Reactions from the Message */
  async removeAll(): Promise<void> {
    await this.client.rest.delete(
      MESSAGE_REACTIONS(this.message.channel.id, this.message.id)
    )
  }

  /** Remove a specific Emoji from Reactions */
  async removeEmoji(emoji: Emoji | string): Promise<MessageReactionsManager> {
    emoji =
      emoji instanceof String && emoji[0] === '<' ? emoji.substring(1) : emoji
    emoji =
      emoji instanceof String && emoji[emoji.length - 1] === '>'
        ? emoji.substring(0, emoji.length - 2)
        : emoji
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
    emoji =
      emoji instanceof String && emoji[0] === '<' ? emoji.substring(1) : emoji
    emoji =
      emoji instanceof String && emoji[emoji.length - 1] === '>'
        ? emoji.substring(0, emoji.length - 2)
        : emoji

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
