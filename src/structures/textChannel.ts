import { MessagesManager } from '../managers/messages.ts'
import { Client } from '../models/client.ts'
import {
  GuildTextChannelPayload,
  MessageOption,
  MessageReference,
  ModifyGuildTextChannelOption,
  ModifyGuildTextChannelPayload,
  Overwrite,
  TextChannelPayload
} from '../types/channel.ts'
import {
  CHANNEL,
  CHANNEL_MESSAGE,
  CHANNEL_MESSAGES,
  MESSAGE_REACTION_ME,
  MESSAGE_REACTION_USER
} from '../types/endpoint.ts'
import { Channel } from './channel.ts'
import { Embed } from './embed.ts'
import { Emoji } from './emoji.ts'
import { Guild } from './guild.ts'
import { Member } from './member.ts'
import { Message } from './message.ts'
import { User } from './user.ts'

export type AllMessageOptions = MessageOption | Embed

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
   * @param text Text content of the Message to send.
   * @param option Various other Message options.
   * @param reply Reference to a Message object to reply-to.
   */
  async send(
    text?: string | AllMessageOptions,
    option?: AllMessageOptions,
    reply?: Message
  ): Promise<Message> {
    if (typeof text === 'object') {
      option = text
      text = undefined
    }
    if (text === undefined && option === undefined) {
      throw new Error('Either text or option is necessary.')
    }
    if (option instanceof Embed)
      option = {
        embed: option
      }

    const payload: any = {
      content: text,
      embed: option?.embed,
      file: option?.file,
      tts: option?.tts,
      allowed_mentions: option?.allowedMentions
    }

    if (reply !== undefined) {
      const reference: MessageReference = {
        message_id: reply.id,
        channel_id: reply.channel.id,
        guild_id: reply.guild?.id
      }
      payload.message_reference = reference
    }

    const resp = await this.client.rest.post(CHANNEL_MESSAGES(this.id), payload)

    const res = new Message(this.client, resp, this, this.client.user as any)
    await res.mentions.fromPayload(resp)
    return res
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
    option?: MessageOption
  ): Promise<Message> {
    if (text === undefined && option === undefined) {
      throw new Error('Either text or option is necessary.')
    }

    if (this.client.user === undefined) {
      throw new Error('Client user has not initialized.')
    }

    const newMsg = await this.client.rest.patch(
      CHANNEL_MESSAGE(
        this.id,
        typeof message === 'string' ? message : message.id
      ),
      {
        content: text,
        embed: option?.embed !== undefined ? option.embed.toJSON() : undefined,
        // Cannot upload new files with Message
        // file: option?.file,
        tts: option?.tts,
        allowed_mentions: option?.allowedMentions
      }
    )

    const res = new Message(this.client, newMsg, this, this.client.user)
    await res.mentions.fromPayload(newMsg)
    return res
  }

  async addReaction(
    message: Message | string,
    emoji: Emoji | string
  ): Promise<void> {
    if (emoji instanceof Emoji) {
      emoji = emoji.getEmojiString
    }
    if (message instanceof Message) {
      message = message.id
    }

    const encodedEmoji = encodeURI(emoji)

    await this.client.rest.put(
      MESSAGE_REACTION_ME(this.id, message, encodedEmoji)
    )
  }

  async removeReaction(
    message: Message | string,
    emoji: Emoji | string,
    user?: User | Member | string
  ): Promise<void> {
    if (emoji instanceof Emoji) {
      emoji = emoji.getEmojiString
    }
    if (message instanceof Message) {
      message = message.id
    }
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
}

export class GuildTextChannel extends TextChannel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  parentID?: string
  rateLimit: number
  topic?: string
  guild: Guild

  get mention(): string {
    return `<#${this.id}>`
  }

  toString(): string {
    return this.mention
  }

  constructor(client: Client, data: GuildTextChannelPayload, guild: Guild) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.guild = guild
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
    this.topic = data.topic
    this.rateLimit = data.rate_limit_per_user
  }

  readFromData(data: GuildTextChannelPayload): void {
    super.readFromData(data)
    this.guildID = data.guild_id ?? this.guildID
    this.name = data.name ?? this.name
    this.position = data.position ?? this.position
    this.permissionOverwrites =
      data.permission_overwrites ?? this.permissionOverwrites
    this.nsfw = data.nsfw ?? this.nsfw
    this.parentID = data.parent_id ?? this.parentID
    this.topic = data.topic ?? this.topic
    this.rateLimit = data.rate_limit_per_user ?? this.rateLimit
  }

  async edit(
    options?: ModifyGuildTextChannelOption
  ): Promise<GuildTextChannel> {
    const body: ModifyGuildTextChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new GuildTextChannel(this.client, resp, this.guild)
  }
}
