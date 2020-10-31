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
import cache from '../models/cache.ts'

export class Message extends Base {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private data: MessagePayload
  id: string
  channelID: string
  guildID?: string
  author: User
  member?: Member
  content: string
  timestamp: string
  editedTimestamp?: string
  tts: boolean
  mentionEveryone: boolean
  mentions: User[]
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

  constructor (client: Client, data: MessagePayload) {
    super(client)
    this.data = data
    this.id = data.id
    this.channelID = data.channel_id
    this.guildID = data.guild_id
    this.author =
      cache.get('user', data.author.id) ?? new User(this.client, data.author)
    this.content = data.content
    this.timestamp = data.timestamp
    this.editedTimestamp = data.edited_timestamp
    this.tts = data.tts
    this.mentionEveryone = data.mention_everyone
    this.mentions = data.mentions.map(
      v => cache.get('user', v.id) ?? new User(client, v)
    )
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
    cache.set('message', this.id, this)
  }

  protected readFromData (data: MessagePayload): void {
    super.readFromData(data)
    this.channelID = data.channel_id ?? this.channelID
    this.guildID = data.guild_id ?? this.guildID
    this.author =
      cache.get('user', data.author.id) ??
      this.author ??
      new User(this.client, data.author)
    this.content = data.content ?? this.content
    this.timestamp = data.timestamp ?? this.timestamp
    this.editedTimestamp = data.edited_timestamp ?? this.editedTimestamp
    this.tts = data.tts ?? this.tts
    this.mentionEveryone = data.mention_everyone ?? this.mentionEveryone
    this.mentions =
      data.mentions.map(
        v => cache.get('user', v.id) ?? new User(this.client, v)
      ) ?? this.mentions
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

  // TODO: We have to seperate fetch()
  async editMessage (text?: string, option?: MessageOption): Promise<Message> {
    if (text !== undefined && option !== undefined) {
      throw new Error('Either text or option is necessary.')
    }
    const resp = await fetch(CHANNEL_MESSAGE(this.channelID, this.id), {
      headers: {
        Authorization: `Bot ${this.client.token}`,
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify({
        content: text,
        embed: option?.embed.toJSON(),
        file: option?.file,
        tts: option?.tts,
        allowed_mentions: option?.allowedMention
      })
    })

    return new Message(this.client, await resp.json())
  }

  // TODO: We have to seperate fetch()
  async delete (): Promise<void> {
    const resp = await fetch(CHANNEL_MESSAGE(this.channelID, this.id), {
      headers: {
        Authorization: `Bot ${this.client.token}`
      },
      method: 'DELETE'
    })

    // TODO: improve Error and Promise
    return await new Promise((resolve, reject) => {
      if (resp.status !== 204) {
        reject(new Error())
      }
      resolve()
    })
  }
}
