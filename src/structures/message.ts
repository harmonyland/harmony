import { Base } from './base.ts'
import {
  Attachment,
  ChannelMention,
  EmbedPayload,
  MessageActivity,
  MessageApplication,
  MessagePayload,
  MessageReference,
  Reaction
} from '../types/channelTypes.ts'
import { Client } from '../models/client.ts'
import { User } from './user.ts'
import { Role } from './role.ts'
import { Embed } from './embed.ts'

class Message extends Base implements MessagePayload {
  id: string
  channel_id: string
  guild_id?: string | undefined
  author: User
  member?: any
  content: string
  timestamp: string
  edited_timestamp: string | undefined
  tts: boolean
  mention_everyone: boolean
  mentions: User[]
  mention_roles: Role[]
  mention_channels?: ChannelMention[] | undefined
  attachments: Attachment[]
  embeds: EmbedPayload[]
  reactions?: Reaction[] | undefined
  nonce?: string | number | undefined
  pinned: boolean
  webhook_id?: string | undefined
  type: number
  activity?: MessageActivity
  application?: MessageApplication
  message_reference?: MessageReference
  flags?: number | undefined

  constructor (client: Client, data: MessagePayload) {
    super(client)
    this.id = data.id
    this.channel_id = data.channel_id
    this.guild_id = data.guild_id
    this.author = data.author
    this.member = data.member
    this.content = data.content
    this.timestamp = data.timestamp
    this.edited_timestamp = data.edited_timestamp
    this.tts = data.tts
    this.mention_everyone = data.mention_everyone
    this.mentions = data.mentions
    this.mention_roles = data.mention_roles
    this.attachments = data.attachments
    this.embeds = data.embeds
    this.reactions = data.reactions
    this.nonce = data.nonce
    this.pinned = data.pinned
    this.webhook_id = data.webhook_id
    this.type = data.type
    this.activity = data.activity
    this.application = data.application
    this.message_reference = data.message_reference
    this.flags = data.flags
  }
}
