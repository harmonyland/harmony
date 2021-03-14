import { Client } from '../models/client.ts'
import { MessageOptions } from '../types/channel.ts'
import { INTERACTION_CALLBACK, WEBHOOK_MESSAGE } from '../types/endpoint.ts'
import {
  InteractionData,
  InteractionOption,
  InteractionPayload,
  InteractionResponsePayload,
  InteractionResponseType
} from '../types/slash.ts'
import { SnowflakeBase } from './base.ts'
import { Embed } from './embed.ts'
import { Guild } from './guild.ts'
import { Member } from './member.ts'
import { Message } from './message.ts'
import { GuildTextChannel, TextChannel } from './textChannel.ts'
import { User } from './user.ts'
import { Webhook } from './webhook.ts'

interface WebhookMessageOptions extends MessageOptions {
  embeds?: Embed[]
  name?: string
  avatar?: string
}

type AllWebhookMessageOptions = string | WebhookMessageOptions

export interface InteractionResponse {
  type?: InteractionResponseType
  content?: string
  embeds?: Embed[]
  tts?: boolean
  flags?: number
  temp?: boolean
  allowedMentions?: {
    parse?: string
    roles?: string[]
    users?: string[]
    everyone?: boolean
  }
}

export class Interaction extends SnowflakeBase {
  /** This will be `SlashClient` in case of `SlashClient#verifyServerRequest` */
  client: Client
  type: number
  token: string
  id: string
  data: InteractionData
  channel: GuildTextChannel
  guild: Guild
  member: Member
  _savedHook?: Webhook
  _respond?: (data: InteractionResponsePayload) => unknown

  constructor(
    client: Client,
    data: InteractionPayload,
    others: {
      channel: GuildTextChannel
      guild: Guild
      member: Member
    }
  ) {
    super(client)
    this.client = client
    this.type = data.type
    this.token = data.token
    this.member = others.member
    this.id = data.id
    this.data = data.data
    this.guild = others.guild
    this.channel = others.channel
  }

  get user(): User {
    return this.member.user
  }

  get name(): string {
    return this.data.name
  }

  get options(): InteractionOption[] {
    return this.data.options ?? []
  }

  option<T = any>(name: string): T {
    return this.options.find((e) => e.name === name)?.value
  }

  /** Respond to an Interaction */
  async respond(data: InteractionResponse): Promise<Interaction> {
    const payload: InteractionResponsePayload = {
      type: data.type ?? InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data:
        data.type === undefined ||
        data.type === InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE ||
        data.type === InteractionResponseType.CHANNEL_MESSAGE
          ? {
              content: data.content ?? '',
              embeds: data.embeds,
              tts: data.tts ?? false,
              flags: data.temp === true ? 64 : data.flags ?? undefined,
              allowed_mentions: (data.allowedMentions ?? undefined) as any
            }
          : undefined
    }

    await this.client.rest.post(
      INTERACTION_CALLBACK(this.id, this.token),
      payload
    )

    return this
  }

  /** Edit the original Interaction response */
  async editResponse(data: {
    content?: string
    embeds?: Embed[]
  }): Promise<Interaction> {
    const url = WEBHOOK_MESSAGE(
      this.client.user?.id as string,
      this.token,
      '@original'
    )
    await this.client.rest.patch(url, {
      content: data.content ?? '',
      embeds: data.embeds ?? []
    })
    return this
  }

  /** Delete the original Interaction Response */
  async deleteResponse(): Promise<Interaction> {
    const url = WEBHOOK_MESSAGE(
      this.client.user?.id as string,
      this.token,
      '@original'
    )
    await this.client.rest.delete(url)
    return this
  }

  get url(): string {
    return `https://discord.com/api/v8/webhooks/${this.client.user?.id}/${this.token}`
  }

  /** Send a followup message */
  async send(
    text?: string | AllWebhookMessageOptions,
    option?: AllWebhookMessageOptions
  ): Promise<Message> {
    if (typeof text === 'object') {
      option = text
      text = undefined
    }

    if (text === undefined && option === undefined) {
      throw new Error('Either text or option is necessary.')
    }

    if (option instanceof Embed)
      option = {
        embeds: [option]
      }

    const payload: any = {
      content: text,
      embeds:
        (option as WebhookMessageOptions)?.embed !== undefined
          ? [(option as WebhookMessageOptions).embed]
          : (option as WebhookMessageOptions)?.embeds !== undefined
          ? (option as WebhookMessageOptions).embeds
          : undefined,
      file: (option as WebhookMessageOptions)?.file,
      tts: (option as WebhookMessageOptions)?.tts,
      allowed_mentions: (option as WebhookMessageOptions)?.allowedMentions
    }

    if ((option as WebhookMessageOptions)?.name !== undefined) {
      payload.username = (option as WebhookMessageOptions)?.name
    }

    if ((option as WebhookMessageOptions)?.avatar !== undefined) {
      payload.avatar = (option as WebhookMessageOptions)?.avatar
    }

    if (
      payload.embeds !== undefined &&
      payload.embeds instanceof Array &&
      payload.embeds.length > 10
    )
      throw new Error(
        `Cannot send more than 10 embeds through Interaction Webhook`
      )

    const resp = await this.client.rest.post(`${this.url}?wait=true`, payload)

    const res = new Message(
      this.client,
      resp,
      (this as unknown) as TextChannel,
      (this as unknown) as User
    )
    await res.mentions.fromPayload(resp)
    return res
  }

  /** Edit a Followup message */
  async editMessage(
    msg: Message | string,
    data: {
      content?: string
      embeds?: Embed[]
      file?: any
      allowed_mentions?: {
        parse?: string
        roles?: string[]
        users?: string[]
        everyone?: boolean
      }
    }
  ): Promise<Interaction> {
    await this.client.rest.patch(
      WEBHOOK_MESSAGE(
        this.client.user?.id as string,
        this.token ?? this.client.token,
        typeof msg === 'string' ? msg : msg.id
      ),
      data
    )
    return this
  }

  async deleteMessage(msg: Message | string): Promise<Interaction> {
    await this.client.rest.delete(
      WEBHOOK_MESSAGE(
        this.client.user?.id as string,
        this.token ?? this.client.token,
        typeof msg === 'string' ? msg : msg.id
      )
    )
    return this
  }
}
