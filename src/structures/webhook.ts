import type { Client } from '../client/mod.ts'
import { RESTManager } from '../rest/mod.ts'
import type { MessageOptions } from '../types/channel.ts'
import type { UserPayload } from '../types/user.ts'
import type { WebhookPayload } from '../types/webhook.ts'
import { Embed } from './embed.ts'
import { Message, MessageAttachment } from './message.ts'
import type { TextChannel } from './textChannel.ts'
import { User } from './user.ts'
import { fetchAuto } from '../../deps.ts'
import { WEBHOOK_MESSAGE, CHANNEL_WEBHOOKS } from '../types/endpoint.ts'
import { Constants } from '../types/constants.ts'

export interface WebhookMessageOptions extends MessageOptions {
  embeds?: Embed[]
  name?: string
  avatar?: string
}

export type AllWebhookMessageOptions = string | WebhookMessageOptions

export interface WebhookEditOptions {
  /** New name to set for Webhook. */
  name?: string
  /** New avatar to set for Webhook. URL of image or base64 encoded data. */
  avatar?: string
  /** New channel for Webhook. Requires authentication. */
  channelID?: string
}

export interface WebhookCreateOptions {
  /** Name of the Webhook. */
  name: string
  /** Base64 image */
  avatar?: string
}

/** Webhook follows different way of instantiation */
export class Webhook {
  client?: Client
  id!: string
  type!: 1 | 2
  guildID?: string
  channelID!: string
  user?: User
  userRaw?: UserPayload
  name?: string
  avatar?: string
  token?: string
  applicationID?: string
  rest: RESTManager

  get url(): string {
    return `${Constants.DISCORD_API_URL}/v${
      this.rest.version ?? Constants.DISCORD_API_VERSION
    }/webhooks/${this.id}/${this.token}`
  }

  constructor(data: WebhookPayload, client?: Client, rest?: RESTManager) {
    if (rest !== undefined) this.rest = rest
    else if (client !== undefined) {
      this.client = client
      this.rest = client.rest
    } else this.rest = new RESTManager()
    this.fromPayload(data)
  }

  private fromPayload(data: WebhookPayload): this {
    this.id = data.id
    this.type = data.type
    this.channelID = data.channel_id
    this.guildID = data.guild_id
    this.user =
      data.user === undefined || this.client === undefined
        ? undefined
        : new User(this.client, data.user)
    if (data.user !== undefined && this.client === undefined)
      this.userRaw = data.user
    this.name = data.name
    this.avatar = data.avatar
    this.token = data.token
    this.applicationID = data.application_id

    return this
  }

  /** Sends a Message through Webhook. */
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

    const payload = {
      content: text,
      embeds:
        (option as WebhookMessageOptions)?.embed !== undefined
          ? [(option as WebhookMessageOptions).embed]
          : (option as WebhookMessageOptions)?.embeds !== undefined
          ? (option as WebhookMessageOptions).embeds
          : undefined,
      file: (option as WebhookMessageOptions)?.file,
      files: (option as WebhookMessageOptions)?.files,
      tts: (option as WebhookMessageOptions)?.tts,
      allowed_mentions: (option as WebhookMessageOptions)?.allowedMentions,
      username: undefined as undefined | string,
      avatar_url: undefined as undefined | string
    }

    if ((option as WebhookMessageOptions)?.name !== undefined) {
      payload.username = (option as WebhookMessageOptions)?.name
    }

    if ((option as WebhookMessageOptions)?.avatar !== undefined) {
      payload.avatar_url = (option as WebhookMessageOptions)?.avatar
    }

    if (
      payload.embeds !== undefined &&
      payload.embeds instanceof Array &&
      payload.embeds.length > 10
    )
      throw new Error(`Cannot send more than 10 embeds through Webhook`)

    const resp = await this.rest.post(this.url + '?wait=true', payload)

    const res = new Message(
      this.client as Client,
      resp,
      this as unknown as TextChannel,
      this as unknown as User
    )
    await res.mentions.fromPayload(resp)
    return res
  }

  /**
   * Creates a Webhook object from URL
   * @param url URL of the Webhook
   * @param client Client (bot) object, if any.
   */
  static async fromURL(url: string | URL, client?: Client): Promise<Webhook> {
    const rest = client !== undefined ? client.rest : new RESTManager()

    const raw = await rest.get(typeof url === 'string' ? url : url.toString())
    if (typeof raw !== 'object')
      throw new Error(`Failed to load Webhook from URL: ${url}`)

    const webhook = new Webhook(raw, client, rest)
    return webhook
  }

  /**
   * Edits the Webhook name, avatar, or channel (requires authentication).
   * @param options Options to edit the Webhook.
   */
  async edit(options: WebhookEditOptions): Promise<Webhook> {
    if (options.channelID !== undefined && this.client === undefined)
      throw new Error('Authentication is required for editing Webhook Channel')
    if (
      options.avatar !== undefined &&
      (options.avatar.startsWith('http:') ||
        options.avatar.startsWith('https:'))
    ) {
      options.avatar = await fetchAuto(options.avatar)
    }

    const data = await this.rest.patch(this.url, options)
    this.fromPayload(data)

    return this
  }

  /** Deletes the Webhook. */
  async delete(): Promise<boolean> {
    await this.rest.delete(this.url)
    return true
  }

  async editMessage(
    message: string | Message,
    data: {
      content?: string
      embeds?: Embed[]
      file?: MessageAttachment
      allowed_mentions?: {
        parse?: string
        roles?: string[]
        users?: string[]
        everyone?: boolean
      }
    }
  ): Promise<Webhook> {
    await this.client?.rest.patch(
      WEBHOOK_MESSAGE(
        this.id,
        (this.token ?? this.client.token) as string,
        typeof message === 'string' ? message : message.id
      ),
      data
    )
    return this
  }

  async deleteMessage(message: string | Message): Promise<Webhook> {
    await this.client?.rest.delete(
      WEBHOOK_MESSAGE(
        this.id,
        (this.token ?? this.client.token) as string,
        typeof message === 'string' ? message : message.id
      )
    )
    return this
  }

  static async create(
    channel: string | TextChannel,
    client: Client,
    body: WebhookCreateOptions
  ): Promise<Webhook> {
    if (typeof channel === 'object') channel = channel.id
    const webhook = await client.rest.post(CHANNEL_WEBHOOKS(channel), body)
    return new Webhook(webhook)
  }
}
