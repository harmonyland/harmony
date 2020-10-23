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
import { UserPayload } from '../types/userTypes.ts'
import { RolePayload } from '../types/roleTypes.ts'

class Message extends Base {
  id: string
  channelID: string
  guildID?: string
  author: UserPayload
  member?: any
  content: string
  timestamp: string
  editedTimestamp?: string
  tts: boolean
  mentionEveryone: boolean
  mentions: UserPayload[]
  mentionRoles: RolePayload[]
  mentionChannels?: ChannelMention[]
  attachments: Attachment[]
  embeds: EmbedPayload[]
  reactions?: Reaction[]
  nonce?: string | number
  pinned: boolean
  webhookId?: string
  type: number
  activity?: MessageActivity
  application?: MessageApplication
  messageReference?: MessageReference
  flags?: number

  constructor (client: Client, data: MessagePayload) {
    super(client)
    this.id = data.id
    this.channelID = data.channel_id
    this.guildID = data.guild_id
    this.author = data.author
    this.member = data.member
    this.content = data.content
    this.timestamp = data.timestamp
    this.editedTimestamp = data.edited_timestamp
    this.tts = data.tts
    this.mentionEveryone = data.mention_everyone
    this.mentions = data.mentions
    this.mentionRoles = data.mention_roles
    this.attachments = data.attachments
    this.embeds = data.embeds
    this.reactions = data.reactions
    this.nonce = data.nonce
    this.pinned = data.pinned
    this.webhookId = data.webhook_id
    this.type = data.type
    this.activity = data.activity
    this.application = data.application
    this.messageReference = data.message_reference
    this.flags = data.flags
  }
}
