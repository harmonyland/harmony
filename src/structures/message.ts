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
} from '../types/channelTypes.ts'
import { Client } from '../models/client.ts'
import { User } from './user.ts'
import { Member } from './member.ts'
import { Embed } from './embed.ts'
import { Role } from './role.ts'
import { CHANNEL_MESSAGE } from '../types/endpoint.ts'

export class Message extends Base {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private data: MessagePayload
  id: string
  channelID: string
  guildID?: string
  author: User
  content: string
  timestamp: string
  editedTimestamp?: string
  tts: boolean

  get member (): Member | undefined {
    if (this.data.member !== undefined) {
      return new Member(this.client, this.data.member)
    }
  }

  mentionEveryone: boolean
  mentions: Member[]
  mentionRoles: Role[]
  mentionChannels?: ChannelMention[]
  attachments: Attachment[]
  embeds: Embed[]
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
    this.data = data
    this.id = data.id
    this.channelID = data.channel_id
    this.guildID = data.guild_id
    this.author = new User(client, data.author)
    this.content = data.content
    this.timestamp = data.timestamp
    this.editedTimestamp = data.edited_timestamp
    this.tts = data.tts
    this.mentionEveryone = data.mention_everyone
    this.mentions = data.mentions.map(v => new Member(client, v))
    this.mentionRoles = data.mention_roles.map(v => new Role(client, v))
    this.attachments = data.attachments
    this.embeds = data.embeds.map(v => new Embed(client, v))
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
        embed: option?.embed,
        file: option?.file,
        tts: option?.tts,
        allowed_mentions: option?.allowedMention
      })
    })

    return new Message(this.client, await resp.json())
  }
}
