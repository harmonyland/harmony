import { CreateInviteOptions } from '../managers/invites.ts'
import { MessagesManager } from '../managers/messages.ts'
import { Client } from '../models/client.ts'
import {
  GuildTextChannelPayload,
  MessageOptions,
  MessagePayload,
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
import { Collection } from '../utils/collection.ts'
import { Permissions } from '../utils/permissions.ts'
import { Channel } from './channel.ts'
import { Embed } from './embed.ts'
import { Emoji } from './emoji.ts'
import { Guild } from './guild.ts'
import { CategoryChannel } from './guildCategoryChannel.ts'
import { Invite } from './invite.ts'
import { Member } from './member.ts'
import { Message } from './message.ts'
import { User } from './user.ts'

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
    if (typeof content === 'object') {
      option = content
      content = undefined
    }
    if (content === undefined && option === undefined) {
      throw new Error('Either text or option is necessary.')
    }
    if (option instanceof Embed) {
      option = {
        embed: option
      }
    }

    const payload: any = {
      content: content,
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
    option?: MessageOptions
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

  /** Add a reaction to a Message in this Channel */
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

  /** Remove Reaction from a Message in this Channel */
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
      const msg = ((await this.messages.get(raw.id)) as unknown) as Message
      res.set(msg.id, msg)
    }

    return res
  }

  /** Trigger the typing indicator. NOT recommended to be used by bots unless you really want to. */
  async triggerTyping(): Promise<TextChannel> {
    await this.client.rest.api.channels[this.id].typing.psot()
    return this
  }
}

/** Represents a Text Channel but in a Guild */
export class GuildTextChannel extends TextChannel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  parentID?: string
  slowmode: number
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
    this.slowmode = data.rate_limit_per_user
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
    this.slowmode = data.rate_limit_per_user ?? this.slowmode
  }

  /** Edit the Guild Text Channel */
  async edit(
    options?: ModifyGuildTextChannelOption
  ): Promise<GuildTextChannel> {
    const body: ModifyGuildTextChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID,
      nsfw: options?.nsfw,
      topic: options?.topic,
      rate_limit_per_user: options?.rateLimitPerUser
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new GuildTextChannel(this.client, resp, this.guild)
  }

  /**
   * Bulk Delete Messages in a Guild Text Channel
   * @param messages Messages to delete. Can be a number, or Array of Message or IDs
   */
  async bulkDelete(
    messages: Array<Message | string> | number
  ): Promise<GuildTextChannel> {
    let ids: string[] = []

    if (Array.isArray(messages))
      ids = messages.map((e) => (typeof e === 'string' ? e : e.id))
    else {
      let list = await this.messages.array()
      if (list.length < messages) list = (await this.fetchMessages()).array()
      ids = list
        .sort((b, a) => a.createdAt.getTime() - b.createdAt.getTime())
        .filter((e, i) => i < messages)
        .filter(
          (e) =>
            new Date().getTime() - e.createdAt.getTime() <=
            1000 * 60 * 60 * 24 * 14
        )
        .map((e) => e.id)
    }

    ids = [...new Set(ids)]
    if (ids.length < 2 || ids.length > 100)
      throw new Error('bulkDelete can only delete messages in range 2-100')

    await this.client.rest.api.channels[this.id].messages['bulk-delete'].post({
      messages: ids
    })

    return this
  }

  /** Create an Invite for this Channel */
  async createInvite(options?: CreateInviteOptions): Promise<Invite> {
    return this.guild.invites.create(this.id, options)
  }

  /** Get Permission Overties for a specific Member */
  async overwritesFor(member: Member | string): Promise<Overwrite[]> {
    member = (typeof member === 'string'
      ? await this.guild.members.get(member)
      : member) as Member
    if (member === undefined) throw new Error('Member not found')
    const roles = await member.roles.array()

    const overwrites: Overwrite[] = []

    for (const overwrite of this.permissionOverwrites) {
      if (overwrite.id === this.guild.id) {
        overwrites.push(overwrite)
      } else if (roles.some((e) => e.id === overwrite.id) === true) {
        overwrites.push(overwrite)
      } else if (overwrite.id === member.id) {
        overwrites.push(overwrite)
      }
    }

    return overwrites
  }

  /** Get Permissions for a Member in this Channel */
  async permissionsFor(member: Member | string): Promise<Permissions> {
    const id = typeof member === 'string' ? member : member.id
    if (id === this.guild.ownerID) return new Permissions(Permissions.ALL)

    member = (typeof member === 'string'
      ? await this.guild.members.get(member)
      : member) as Member
    if (member === undefined) throw new Error('Member not found')

    if (member.permissions.has('ADMINISTRATOR') === true)
      return new Permissions(Permissions.ALL)

    const overwrites = await this.overwritesFor(member)
    const everyoneOW = overwrites.find((e) => e.id === this.guild.id)
    const roleOWs = overwrites.filter((e) => e.type === 0)
    const memberOWs = overwrites.filter((e) => e.type === 1)

    return member.permissions
      .remove(everyoneOW !== undefined ? Number(everyoneOW.deny) : 0)
      .add(everyoneOW !== undefined ? Number(everyoneOW.allow) : 0)
      .remove(roleOWs.length === 0 ? 0 : roleOWs.map((e) => Number(e.deny)))
      .add(roleOWs.length === 0 ? 0 : roleOWs.map((e) => Number(e.allow)))
      .remove(memberOWs.length === 0 ? 0 : memberOWs.map((e) => Number(e.deny)))
      .add(memberOWs.length === 0 ? 0 : memberOWs.map((e) => Number(e.allow)))
  }

  /** Edit name of the channel */
  async setName(name: string): Promise<GuildTextChannel> {
    return await this.edit({ name })
  }

  /** Edit topic of the channel */
  async setTopic(topic: string): Promise<GuildTextChannel> {
    return await this.edit({ topic })
  }

  /** Edit topic of the channel */
  async setCategory(
    category: CategoryChannel | string
  ): Promise<GuildTextChannel> {
    return await this.edit({
      parentID: typeof category === 'object' ? category.id : category
    })
  }

  /** Edit position of the channel */
  async setPosition(position: number): Promise<GuildTextChannel> {
    return await this.edit({ position })
  }

  /** Edit Slowmode of the channel */
  async setSlowmode(slowmode?: number | null): Promise<GuildTextChannel> {
    return await this.edit({ rateLimitPerUser: slowmode ?? null })
  }

  /** Edit NSFW property of the channel */
  async setNSFW(nsfw: boolean): Promise<GuildTextChannel> {
    return await this.edit({ nsfw })
  }

  /** Set Permission Overwrites of the Channel */
  async setOverwrites(overwrites: Overwrite[]): Promise<GuildTextChannel> {
    return await this.edit({ permissionOverwrites: overwrites })
  }

  /** Add a Permission Overwrite */
  async addOverwrite(overwrite: Overwrite): Promise<GuildTextChannel> {
    const overwrites = this.permissionOverwrites
    overwrites.push(overwrite)
    return await this.edit({ permissionOverwrites: overwrites })
  }

  /** Remove a Permission Overwrite */
  async removeOverwrite(id: string): Promise<GuildTextChannel> {
    if (this.permissionOverwrites.findIndex((e) => e.id === id) < 0)
      throw new Error('Permission Overwrite not found')
    const overwrites = this.permissionOverwrites.filter((e) => e.id !== id)
    return await this.edit({ permissionOverwrites: overwrites })
  }

  /** Edit a Permission Overwrite */
  async editOverwrite(overwrite: Overwrite): Promise<GuildTextChannel> {
    const index = this.permissionOverwrites.findIndex(
      (e) => e.id === overwrite.id
    )
    if (index < 0) throw new Error('Permission Overwrite not found')
    const overwrites = this.permissionOverwrites
    overwrites[index] = overwrite
    return await this.edit({ permissionOverwrites: overwrites })
  }
}
