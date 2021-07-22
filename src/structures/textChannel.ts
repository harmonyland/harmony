import { MessagesManager } from '../managers/messages.ts'
import type { Client } from '../client/mod.ts'
import type {
  MessageOptions,
  MessagePayload,
  TextChannelPayload
} from '../types/channel.ts'
import {
  MESSAGE_REACTION_ME,
  MESSAGE_REACTION_USER
} from '../types/endpoint.ts'
import { Collection } from '../utils/collection.ts'
import { Channel } from './channel.ts'
import type { Embed } from './embed.ts'
import { Emoji } from './emoji.ts'
import type { Member } from './member.ts'
import { Message } from './message.ts'
import type { User } from './user.ts'

export type AllMessageOptions = MessageOptions | Embed

/** Channel object for Text Channel type */
export class TextChannel extends Channel {
  lastMessageID?: string
  lastPinTimestamp?: string
  messages: MessagesManager

  constructor(client: Client, data: TextChannelPayload) {
    super(client, data)
    this.messages = new MessagesManager(this.client, this)
    this.lastMessageID = data.last_message_id
    this.lastPinTimestamp = data.last_pin_timestamp
  }

  readFromData(data: TextChannelPayload): void {
    super.readFromData(data)
    this.lastMessageID = data.last_message_id ?? this.lastMessageID
    this.lastPinTimestamp = data.last_pin_timestamp ?? this.lastPinTimestamp
  }

  /**
   *
   * @param content Text content of the Message to send.
   * @param option Various other Message options.
   * @param reply Reference to a Message object to reply-to.
   */
  async send(
    content?: string | AllMessageOptions,
    option?: AllMessageOptions,
    reply?: Message
  ): Promise<Message> {
    return this.client.channels.sendMessage(
      this,
      content,
      Object.assign(option ?? {}, { reply })
    )
  }

  /**
   *
   * @param message Message to edit. ID or the Message object itself.
   * @param text New text contents of the Message.
   * @param option Other options to edit the message.
   */
  async editMessage(
    message: Message | string,
    text?: string,
    option?: MessageOptions
  ): Promise<Message> {
    return this.client.channels.editMessage(this, message, text, option)
  }

  /** Add a reaction to a Message in this Channel */
  async addReaction(
    message: Message | string,
    emoji: Emoji | string
  ): Promise<void> {
    if (emoji instanceof Emoji) {
      emoji = `${emoji.name}:${emoji.id}`
    } else if (emoji.length > 4) {
      if (!isNaN(Number(emoji))) {
        const findEmoji = await this.client.emojis.get(emoji)
        if (findEmoji !== undefined) emoji = `${findEmoji.name}:${findEmoji.id}`
        else throw new Error(`Emoji not found: ${emoji}`)
      }
    }
    if (message instanceof Message) message = message.id
    const encodedEmoji = encodeURI(emoji)

    await this.client.rest.put(
      MESSAGE_REACTION_ME(this.id, message, encodedEmoji)
    )
  }

  /** Remove Reaction from a Message in this Channel */
  async removeReaction(
    message: Message | string,
    emoji: Emoji | string,
    user?: User | Member | string
  ): Promise<void> {
    if (emoji instanceof Emoji) {
      emoji = `${emoji.name}:${emoji.id}`
    } else if (emoji.length > 4) {
      if (!isNaN(Number(emoji))) {
        const findEmoji = await this.client.emojis.get(emoji)
        if (findEmoji !== undefined) emoji = `${findEmoji.name}:${findEmoji.id}`
        else throw new Error(`Emoji not found: ${emoji}`)
      }
    }
    if (message instanceof Message) message = message.id
    if (user !== undefined) {
      if (typeof user !== 'string') {
        user = user.id
      }
    }

    const encodedEmoji = encodeURI(emoji)

    if (user === undefined) {
      await this.client.rest.delete(
        MESSAGE_REACTION_ME(this.id, message, encodedEmoji)
      )
    } else {
      await this.client.rest.delete(
        MESSAGE_REACTION_USER(this.id, message, encodedEmoji, user)
      )
    }
  }

  /**
   * Fetch Messages of a Channel
   * @param options Options to configure fetching Messages
   */
  async fetchMessages(options?: {
    limit?: number
    around?: Message | string
    before?: Message | string
    after?: Message | string
  }): Promise<Collection<string, Message>> {
    const res = new Collection<string, Message>()
    const raws = (await this.client.rest.api.channels[this.id].messages.get({
      limit: options?.limit ?? 50,
      around:
        options?.around === undefined
          ? undefined
          : typeof options.around === 'string'
          ? options.around
          : options.around.id,
      before:
        options?.before === undefined
          ? undefined
          : typeof options.before === 'string'
          ? options.before
          : options.before.id,
      after:
        options?.after === undefined
          ? undefined
          : typeof options.after === 'string'
          ? options.after
          : options.after.id
    })) as MessagePayload[]

    for (const raw of raws) {
      await this.messages.set(raw.id, raw)
      const msg = (await this.messages.get(raw.id)) as unknown as Message
      res.set(msg.id, msg)
    }

    return res
  }

  async getPinnedMessages(): Promise<Collection<string, Message>> {
    return this.client.channels.getPinnedMessages(this)
  }

  async pinMessage(message: string | Message): Promise<void> {
    return this.client.channels.pinMessage(this, message)
  }

  async unpinMessage(message: string | Message): Promise<void> {
    return this.client.channels.unpinMessage(this, message)
  }

  /** Trigger the typing indicator. NOT recommended to be used by bots unless you really want to. */
  async triggerTyping(): Promise<TextChannel> {
    await this.client.rest.api.channels[this.id].typing.post()
    return this
  }
}
