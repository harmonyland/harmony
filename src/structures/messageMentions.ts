import type { Client } from '../client/mod.ts'
import type { MessagePayload } from '../types/channel.ts'
import { Collection } from '../utils/collection.ts'
import { GuildTextBasedChannel } from './guildTextChannel.ts'
import type { Message } from './message.ts'
import type { Role } from './role.ts'
import { User } from './user.ts'

export class MessageMentions {
  client: Client
  message: Message
  users: Collection<string, User> = new Collection()
  roles: Collection<string, Role> = new Collection()
  channels: Collection<string, GuildTextBasedChannel> = new Collection()
  everyone: boolean = false

  static EVERYONE_MENTION = /@(everyone|here)/g
  static USER_MENTION = /<@!?(\d{17,19})>/g
  static ROLE_MENTION = /<@&(\d{17,19})>/g
  static CHANNEL_MENTION = /<#(\d{17,19})>/g

  constructor(client: Client, message: Message) {
    this.client = client
    this.message = message
  }

  async fromPayload(payload: MessagePayload): Promise<MessageMentions> {
    if (this.message === undefined) return this
    if (payload.mentions !== undefined)
      payload.mentions.forEach((rawUser) => {
        this.users.set(rawUser.id, new User(this.client, rawUser))
      })

    if (this.message.guild !== undefined) {
      for (const id of payload.mention_roles) {
        const role = await this.message.guild.roles.get(id)
        if (role !== undefined) this.roles.set(role.id, role)
      }
    }
    if (payload.mention_channels !== undefined) {
      for (const mentionChannel of payload.mention_channels) {
        const channel = await this.client.channels.get<GuildTextBasedChannel>(
          mentionChannel.id
        )
        if (channel !== undefined) this.channels.set(channel.id, channel)
      }
    }
    const matchChannels = this.message.content.match(
      MessageMentions.CHANNEL_MENTION
    )
    if (matchChannels !== null) {
      for (const id of matchChannels) {
        const parsedID = id.substr(2, id.length - 3)
        const channel = await this.client.channels.get<GuildTextBasedChannel>(
          parsedID
        )
        if (channel !== undefined) this.channels.set(channel.id, channel)
      }
    }
    this.everyone = payload.mention_everyone
    return this
  }
}
