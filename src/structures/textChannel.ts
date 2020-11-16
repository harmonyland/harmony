import { MessagesManager } from "../../mod.ts"
import { Client } from '../models/client.ts'
import { GuildTextChannelPayload, MessageOption, Overwrite, TextChannelPayload } from '../types/channel.ts'
import { CHANNEL_MESSAGE, CHANNEL_MESSAGES } from '../types/endpoint.ts'
import { Channel } from './channel.ts'
import { Embed } from './embed.ts'
import { Guild } from "./guild.ts"
import { Message } from './message.ts'

type AllMessageOptions = MessageOption | Embed

export class TextChannel extends Channel {
  lastMessageID?: string
  lastPinTimestamp?: string
  messages: MessagesManager

  constructor (client: Client, data: TextChannelPayload) {
    super(client, data)
    this.messages = new MessagesManager(this.client, this)
    this.lastMessageID = data.last_message_id
    this.lastPinTimestamp = data.last_pin_timestamp
  }

  protected readFromData (data: TextChannelPayload): void {
    super.readFromData(data)
    this.lastMessageID = data.last_message_id ?? this.lastMessageID
    this.lastPinTimestamp = data.last_pin_timestamp ?? this.lastPinTimestamp
  }

  async send (text?: string | AllMessageOptions, option?: AllMessageOptions): Promise<Message> {
    if (typeof text === "object") {
      option = text
      text = undefined
    }
    if (text === undefined && option === undefined) {
      throw new Error('Either text or option is necessary.')
    }
    if (option instanceof Embed) option = {
      embed: option
    }
    
    const resp = await this.client.rest.post(CHANNEL_MESSAGES(this.id), {
        content: text,
        embed: option?.embed,
        file: option?.file,
        tts: option?.tts,
        allowed_mentions: option?.allowedMention
    })

    const res = new Message(this.client, resp, this, this.client.user as any)
    await res.mentions.fromPayload(resp)
    return res
  }

  async editMessage (
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
        embed: option?.embed.toJSON(),
        file: option?.file,
        tts: option?.tts,
        allowed_mentions: option?.allowedMention
      }
    )

    const res = new Message(this.client, newMsg, this, this.client.user)
    await res.mentions.fromPayload(newMsg)
    return res
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

  get mention (): string {
    return `<#${this.id}>`
  }

  toString(): string {
    return this.mention
  }

  constructor (client: Client, data: GuildTextChannelPayload, guild: Guild) {
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

  protected readFromData (data: GuildTextChannelPayload): void {
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
}
