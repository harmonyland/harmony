import { Base } from './base.ts'
import {
  Attachment,
  ChannelMention,
  MessageActivity,
  MessageApplication,
  MessageOption,
  MessagePayload,
  MessageReference
} from '../types/channel.ts'
import { Client } from '../models/client.ts'
import { User } from './user.ts'
import { Member } from './member.ts'
import { Embed } from './embed.ts'
import { CHANNEL_MESSAGE } from '../types/endpoint.ts'
import { MessageMentions } from './messageMentions.ts'
import { TextChannel } from './textChannel.ts'
import { Guild } from './guild.ts'
import { MessageReactionsManager } from '../managers/messageReactions.ts'

type AllMessageOptions = MessageOption | Embed

export class Message extends Base {
  id: string
  channelID: string
  channel: TextChannel
  guildID?: string
  guild?: Guild
  author: User
  member?: Member
  content: string
  timestamp: string
  editedTimestamp?: string
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
    this.timestamp = data.timestamp
    this.editedTimestamp = data.edited_timestamp
    this.tts = data.tts
    this.mentions = new MessageMentions(this.client, this)
    this.attachments = data.attachments
    this.embeds = data.embeds.map((v) => new Embed(v))
    this.reactions = new MessageReactionsManager(this.client, this)
    this.nonce = data.nonce
    this.pinned = data.pinned
    this.webhookID = data.webhook_id
    this.type = data.type
    this.activity = data.activity
    this.application = data.application
    this.messageReference = data.message_reference
    this.flags = data.flags
    this.channel = channel
  }

  readFromData(data: MessagePayload): void {
    this.channelID = data.channel_id ?? this.channelID
    this.guildID = data.guild_id ?? this.guildID
    this.content = data.content ?? this.content
    this.timestamp = data.timestamp ?? this.timestamp
    this.editedTimestamp = data.edited_timestamp ?? this.editedTimestamp
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
  }

  /** Edits this message. */
  async edit(text?: string, option?: MessageOption): Promise<Message> {
    if (
      this.client.user !== undefined &&
      this.author.id !== this.client.user?.id
    )
      throw new Error("Cannot edit other users' messages")
    return this.channel.editMessage(this.id, text, option)
  }

  /** Creates a Reply to this Message. */
  async reply(
    text?: string | AllMessageOptions,
    option?: AllMessageOptions
  ): Promise<Message> {
    return this.channel.send(text, option, this)
  }

  /** Deletes the Message. */
  async delete(): Promise<void> {
    return this.client.rest.delete(CHANNEL_MESSAGE(this.channelID, this.id))
  }
}
