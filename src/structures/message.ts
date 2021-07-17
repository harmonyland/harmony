import { SnowflakeBase } from './base.ts'
import {
  Attachment,
  MessageActivity,
  MessageApplication,
  MessageInteractionPayload,
  MessageOptions,
  MessagePayload,
  MessageReference
} from '../types/channel.ts'
import type { Client } from '../client/mod.ts'
import { User } from './user.ts'
import type { Member } from './member.ts'
import { Embed } from './embed.ts'
import { CHANNEL_MESSAGE } from '../types/endpoint.ts'
import { MessageMentions } from './messageMentions.ts'
import type { TextChannel } from './textChannel.ts'
import type {
  CreateThreadOptions,
  GuildTextBasedChannel,
  GuildTextChannel
} from './guildTextChannel.ts'
import type { Guild } from './guild.ts'
import { MessageReactionsManager } from '../managers/messageReactions.ts'
import { MessageSticker } from './messageSticker.ts'
import type { Emoji } from './emoji.ts'
import type { InteractionType } from '../types/interactions.ts'
import { encodeText } from '../utils/encoding.ts'
import { MessageComponentData } from '../types/messageComponents.ts'
import { transformComponentPayload } from '../utils/components.ts'
import { ThreadChannel } from './threadChannel.ts'

type AllMessageOptions = MessageOptions | Embed

export class MessageInteraction extends SnowflakeBase {
  id: string
  name: string
  type: InteractionType
  user: User

  constructor(client: Client, data: MessageInteractionPayload) {
    super(client)
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.user = new User(this.client, data.user)
  }
}

export class Message extends SnowflakeBase {
  id: string
  channelID: string
  channel: TextChannel
  guildID?: string
  guild?: Guild
  author: User
  member?: Member
  content: string
  editedTimestamp?: Date
  tts: boolean
  mentions: MessageMentions
  attachments: Attachment[]
  embeds: Embed[]
  reactions: MessageReactionsManager
  nonce?: string | number
  pinned: boolean
  webhookID?: string
  type: number
  activity?: MessageActivity
  application?: MessageApplication
  messageReference?: MessageReference
  flags?: number
  stickers?: MessageSticker[]
  interaction?: MessageInteraction
  createdTimestamp: Date
  components: MessageComponentData[] = []

  get createdAt(): Date {
    return this.createdTimestamp // new Date(this.timestamp)
  }

  constructor(
    client: Client,
    data: MessagePayload,
    channel: TextChannel,
    author: User
  ) {
    super(client)
    this.id = data.id
    this.channelID = data.channel_id
    this.guildID = data.guild_id
    this.author = author
    this.content = data.content
    this.createdTimestamp = new Date(data.timestamp)
    this.editedTimestamp =
      data.edited_timestamp === undefined
        ? undefined
        : new Date(data.edited_timestamp)
    this.tts = data.tts
    this.mentions = new MessageMentions(this.client, this)
    this.attachments = data.attachments
    this.embeds = (data.embeds ?? []).map((v) => new Embed(v))
    this.reactions = new MessageReactionsManager(this.client, this)
    this.nonce = data.nonce
    this.pinned = data.pinned
    this.webhookID = data.webhook_id
    this.type = data.type
    this.activity = data.activity
    this.application = data.application
    this.messageReference = data.message_reference
    this.flags = data.flags ?? 0
    this.channel = channel
    this.stickers =
      data.stickers !== undefined
        ? data.stickers.map(
            (payload) => new MessageSticker(this.client, payload)
          )
        : undefined
    this.interaction =
      data.interaction === undefined
        ? undefined
        : new MessageInteraction(this.client, data.interaction)
    this.components =
      data.components === undefined
        ? []
        : transformComponentPayload(data.components)
  }

  readFromData(data: MessagePayload): void {
    this.channelID = data.channel_id ?? this.channelID
    this.guildID = data.guild_id ?? this.guildID
    this.content = data.content ?? this.content
    this.editedTimestamp =
      data.edited_timestamp === undefined
        ? this.editedTimestamp
        : new Date(data.edited_timestamp)
    this.tts = data.tts ?? this.tts
    this.attachments = data.attachments ?? this.attachments
    this.embeds = data.embeds.map((v) => new Embed(v)) ?? this.embeds
    this.nonce = data.nonce ?? this.nonce
    this.pinned = data.pinned ?? this.pinned
    this.webhookID = data.webhook_id ?? this.webhookID
    this.type = data.type ?? this.type
    this.activity = data.activity ?? this.activity
    this.application = data.application ?? this.application
    this.messageReference = data.message_reference ?? this.messageReference
    this.flags = data.flags ?? this.flags
    this.stickers =
      data.stickers !== undefined
        ? data.stickers.map(
            (payload) => new MessageSticker(this.client, payload)
          )
        : this.stickers
    this.interaction =
      data.interaction === undefined
        ? this.interaction
        : new MessageInteraction(this.client, data.interaction)
    this.components =
      data.components === undefined
        ? []
        : transformComponentPayload(data.components)
  }

  async updateRefs(): Promise<void> {
    if (this.guildID !== undefined)
      this.guild = await this.client.guilds.get(this.guildID)
    const newVal = await this.client.channels.get<TextChannel>(this.channelID)
    if (newVal !== undefined) this.channel = newVal
    const newUser = await this.client.users.get(this.author.id)
    if (newUser !== undefined) this.author = newUser
    if (this.member !== undefined) {
      const newMember = await this.guild?.members.get(this.member?.id)
      if (newMember !== undefined) this.member = newMember
    }
    if ((this.channel as unknown as GuildTextBasedChannel).guild !== undefined)
      this.guild = (this.channel as unknown as GuildTextBasedChannel).guild
    if (this.guild !== undefined && this.guildID === undefined)
      this.guildID = this.guild.id
  }

  /** Edits this message. */
  async edit(
    content?: string | AllMessageOptions,
    option?: AllMessageOptions
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
    if (
      this.client.user !== undefined &&
      this.author.id !== this.client.user?.id
    ) {
      throw new Error("Cannot edit other users' messages")
    }
    return this.channel.editMessage(this.id, content, option)
  }

  /** Creates a Reply to this Message. */
  async reply(
    content?: string | AllMessageOptions,
    option?: AllMessageOptions
  ): Promise<Message> {
    return this.channel.send(content, option, this)
  }

  /** Deletes the Message. */
  async delete(): Promise<void> {
    return this.client.rest.delete(CHANNEL_MESSAGE(this.channelID, this.id))
  }

  /**
   * Adds a reaction to the message.
   * @param emoji Emoji in string or object
   */
  async addReaction(emoji: string | Emoji): Promise<void> {
    return this.channel.addReaction(this, emoji)
  }

  /**
   * Removes a reaction to the message.
   * @param emoji Emoji in string or object
   * @param user User or Member or user id
   */
  async removeReaction(
    emoji: string | Emoji,
    user?: User | Member | string
  ): Promise<void> {
    return this.channel.removeReaction(this, emoji, user)
  }

  async startThread(options: CreateThreadOptions): Promise<ThreadChannel> {
    if (this.channel.isGuildText() === true) {
      const chan = this.channel as unknown as GuildTextChannel
      return chan.startThread(options, this)
    } else throw new Error('Threads can only be made in Guild Text Channels')
  }
}

/** Message Attachment that can be sent while Creating Message */
export class MessageAttachment {
  name: string
  blob: Blob

  constructor(name: string, blob: Blob | Uint8Array | string) {
    this.name = name
    this.blob =
      typeof blob === 'string'
        ? new Blob([encodeText(blob)])
        : blob instanceof Uint8Array
        ? new Blob([blob])
        : blob
  }

  /** Load an Message Attachment from local file or URL */
  static async load(
    path: string,
    filename?: string
  ): Promise<MessageAttachment> {
    const blob = path.startsWith('http')
      ? await fetch(path).then((res) => res.blob())
      : await Deno.readFile(path)

    if (filename === undefined) {
      const split = path.replaceAll('\\', '/').split('/').pop()
      if (split !== undefined) filename = split.split('?')[0].split('#')[0]
      else filename = 'unnamed_attachment'
    }

    return new MessageAttachment(filename, blob)
  }
}
