import { Base } from './base.ts'
import {
  Attachment,
  ChannelMention,
  MessageActivity,
  MessageApplication,
  MessageOption,
  MessagePayload,
  MessageReference,
  Reaction
} from '../types/channel.ts'
import { Client } from '../models/client.ts'
import { User } from './user.ts'
import { Member } from './member.ts'
import { Embed } from './embed.ts'
import { CHANNEL_MESSAGE } from '../types/endpoint.ts'
import { MessageMentions } from './messageMentions.ts'
import { TextChannel } from './textChannel.ts'
import { DMChannel } from './dmChannel.ts'
import { Guild } from './guild.ts'

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
  mentionEveryone: boolean
  mentions: MessageMentions
  mentionRoles: string[]
  mentionChannels?: ChannelMention[]
  attachments: Attachment[]
  embeds: Embed[]
  reactions?: Reaction[]
  nonce?: string | number
  pinned: boolean
  webhookID?: string
  type: number
  activity?: MessageActivity
  application?: MessageApplication
  messageReference?: MessageReference
  flags?: number

  constructor (
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
    this.mentionEveryone = data.mention_everyone
    this.mentions = new MessageMentions(this.client, this)
    this.mentionRoles = data.mention_roles
    this.mentionChannels = data.mention_channels
    this.attachments = data.attachments
    this.embeds = data.embeds.map(v => new Embed(v))
    this.reactions = data.reactions
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

  protected readFromData (data: MessagePayload): void {
    super.readFromData(data)
    this.channelID = data.channel_id ?? this.channelID
    this.guildID = data.guild_id ?? this.guildID
    this.content = data.content ?? this.content
    this.timestamp = data.timestamp ?? this.timestamp
    this.editedTimestamp = data.edited_timestamp ?? this.editedTimestamp
    this.tts = data.tts ?? this.tts
    this.mentionEveryone = data.mention_everyone ?? this.mentionEveryone
    this.mentionRoles = data.mention_roles ?? this.mentionRoles
    this.mentionChannels = data.mention_channels ?? this.mentionChannels
    this.attachments = data.attachments ?? this.attachments
    this.embeds = data.embeds.map(v => new Embed(v)) ?? this.embeds
    this.reactions = data.reactions ?? this.reactions
    this.nonce = data.nonce ?? this.nonce
    this.pinned = data.pinned ?? this.pinned
    this.webhookID = data.webhook_id ?? this.webhookID
    this.type = data.type ?? this.type
    this.activity = data.activity ?? this.activity
    this.application = data.application ?? this.application
    this.messageReference = data.message_reference ?? this.messageReference
    this.flags = data.flags ?? this.flags
  }

  async edit (text?: string, option?: MessageOption): Promise<Message> {
    return this.channel.editMessage(this.id, text, option)  
  }

  async reply(text?: string | AllMessageOptions, option?: AllMessageOptions): Promise<Message> {
    // TODO: Use inline replies once they're out
    if (this.channel instanceof DMChannel) return this.channel.send(text, option)
    return this.channel.send(`${this.author.mention}, ${text}`, option)
  }

  async delete (): Promise<void> {
    return this.client.rest.delete(CHANNEL_MESSAGE(this.channelID, this.id))
  }
}
