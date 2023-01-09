import type { Client } from '../client/client.ts'
import { transformComponent } from '../utils/components.ts'
import {
  AllowedMentionsPayload,
  ChannelTypes,
  EmbedPayload,
  MessageOptions
} from '../types/channel.ts'
import { Constants } from '../types/constants.ts'
import { INTERACTION_CALLBACK, WEBHOOK_MESSAGE } from '../types/endpoint.ts'
import {
  InteractionPayload,
  InteractionResponseFlags,
  InteractionResponsePayload,
  InteractionResponseType,
  InteractionType
} from '../types/interactions.ts'
import {
  InteractionMessageComponentData,
  InteractionModalSubmitData,
  MessageComponentData
} from '../types/messageComponents.ts'
import {
  ApplicationCommandChoice,
  InteractionApplicationCommandData,
  InteractionChannelPayload
} from '../types/applicationCommand.ts'
import { Permissions } from '../utils/permissions.ts'
import { SnowflakeBase } from './base.ts'
import { Channel } from './channel.ts'
import { Embed } from './embed.ts'
import { Guild } from './guild.ts'
import { GuildTextChannel } from './guildTextChannel.ts'
import { Member } from './member.ts'
import { Message, MessageAttachment } from './message.ts'
import { TextChannel } from './textChannel.ts'
import { User } from './user.ts'
import type { ApplicationCommandInteraction } from './applicationCommand.ts'
import type { MessageComponentInteraction } from './messageComponents.ts'
import type { AutocompleteInteraction } from './autocompleteInteraction.ts'
import type { ModalSubmitInteraction } from './modalSubmitInteraction.ts'

interface WebhookMessageOptions extends MessageOptions {
  name?: string
  avatar?: string
  flags?: number
  ephemeral?: boolean
}

type AllWebhookMessageOptions = string | WebhookMessageOptions

export interface BaseInteractionResponse {
  type?: InteractionResponseType | keyof typeof InteractionResponseType
}

/** Interaction Message related Options */
export interface InteractionMessageOptions {
  content?: string
  embeds?: Array<Embed | EmbedPayload>
  tts?: boolean
  flags?: number | InteractionResponseFlags[]
  allowedMentions?: AllowedMentionsPayload
  /** Whether the Message Response should be Ephemeral (only visible to User) or not */
  ephemeral?: boolean
  components?: MessageComponentData[]
  files?: MessageAttachment[]
}

export interface InteractionResponseAutocompleteChoices {
  choices?: ApplicationCommandChoice[]
}

export interface InteractionResponseModal {
  title: string
  customID: string
  components: MessageComponentData[]
}

export type InteractionResponse = BaseInteractionResponse &
  (
    | InteractionMessageOptions
    | InteractionResponseAutocompleteChoices
    | InteractionResponseModal
  )

function isResponseMessage(
  response: InteractionResponse
): response is InteractionMessageOptions & BaseInteractionResponse {
  return (
    response.type === undefined ||
    response.type === InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE ||
    response.type === InteractionResponseType.UPDATE_MESSAGE ||
    response.type === InteractionResponseType.DEFERRED_CHANNEL_MESSAGE ||
    response.type === InteractionResponseType.DEFERRED_MESSAGE_UPDATE
  )
}

function isResponseModal(
  response: InteractionResponse
): response is InteractionResponseModal & BaseInteractionResponse {
  return response.type === InteractionResponseType.MODAL
}

/** Represents a Channel Object for an Option in Slash Command */
export class InteractionChannel extends SnowflakeBase {
  /** Name of the Channel */
  name: string
  /** Channel Type */
  type: ChannelTypes
  permissions: Permissions

  constructor(client: Client, data: InteractionChannelPayload) {
    super(client)
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.permissions = new Permissions(data.permissions)
  }

  /** Resolve to actual Channel object if present in Cache */
  async resolve<T extends Channel = Channel>(): Promise<T | undefined> {
    return this.client.channels.get<T>(this.id)
  }
}

export class InteractionUser extends User {
  member?: Member
}

/**
 * Represents a base Interaction.
 *
 * There are different types of interactions which have different actions you
 * can perform ("respond") based on. Because of that, Interaction class is extended
 * by those subclasses to structure the code properly.
 *
 * You will be (most of the time if not all) provided with an Interaction object that
 * is actually one of those subclasses, but just TS-type is Interaction - in that case
 * you use type-guards such as `isApplicationCommand`, `isMessageComponent`, etc.
 */
export class Interaction extends SnowflakeBase {
  /** Type of Interaction */
  type: InteractionType
  /** Interaction Token */
  token: string
  /** Interaction ID */
  id: string
  /** Channel in which Interaction was initiated */
  channel?: TextChannel | GuildTextChannel
  /** Guild in which Interaction was initiated */
  guild?: Guild
  /** Member object of who initiated the Interaction */
  member?: Member
  /** User object of who invoked Interaction */
  user: User
  /** Whether we have responded to Interaction or not */
  responded: boolean = false
  /** Whether response was deferred or not */
  deferred: boolean = false
  _httpRespond?: (d: InteractionResponsePayload) => unknown
  _httpResponded?: boolean
  applicationID: string
  /** Data sent with Interaction. Only applies to Application Command */
  data?:
    | InteractionApplicationCommandData
    | InteractionMessageComponentData
    | InteractionModalSubmitData

  message?: Message

  /** User locale (not present on PING type) */
  locale?: string

  /** Guild locale (not present on PING type) */
  guildLocale?: string

  constructor(
    client: Client,
    data: InteractionPayload,
    others: {
      channel?: TextChannel | GuildTextChannel
      guild?: Guild
      member?: Member
      user: User
      message?: Message
    }
  ) {
    super(client)
    this.type = data.type
    this.token = data.token
    this.member = others.member
    this.id = data.id
    this.applicationID = data.application_id
    this.user = others.user
    this.data = data.data
    this.guild = others.guild
    this.channel = others.channel
    this.message = others.message
    this.locale = data.locale
    this.guildLocale = data.guild_locale
  }

  /**
   * @deprecated Use isApplicationCommand instead
   */
  isSlashCommand(): this is ApplicationCommandInteraction {
    return this.type === InteractionType.APPLICATION_COMMAND
  }

  /** Checks whether the Interaction is Ping (HTTP only) */
  isPing(): boolean {
    return this.type === InteractionType.PING
  }

  /** Checks whether the Interaction is Application Command */
  isApplicationCommand(): this is ApplicationCommandInteraction {
    return this.type === InteractionType.APPLICATION_COMMAND
  }

  /** Checks whether the Interaction is Message Component */
  isMessageComponent(): this is MessageComponentInteraction {
    return this.type === InteractionType.MESSAGE_COMPONENT
  }

  /** Checks whether the Interaction is for Application Command Option autocompletions */
  isAutocomplete(): this is AutocompleteInteraction {
    return this.type === InteractionType.AUTOCOMPLETE
  }

  /** Checks whether the Interaction is for the modal/form submitted by the user */
  isModalSubmit(): this is ModalSubmitInteraction {
    return this.type === InteractionType.MODAL_SUBMIT
  }

  /** Respond to an Interaction */
  async respond(data: InteractionResponse): Promise<this> {
    if (this.responded) throw new Error('Already responded to Interaction')

    let flags = 0
    if (isResponseMessage(data) && data.ephemeral === true)
      flags |= InteractionResponseFlags.EPHEMERAL
    if (isResponseMessage(data) && data.flags !== undefined) {
      if (Array.isArray(data.flags)) {
        flags = data.flags.reduce((p, a) => p | a, flags)
      } else if (typeof data.flags === 'number') flags |= data.flags
    }

    const payload: InteractionResponsePayload = {
      type:
        data.type === undefined
          ? InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
          : typeof data.type === 'string'
          ? InteractionResponseType[data.type]
          : data.type,
      data: isResponseModal(data)
        ? {
            title: data.title,
            components: transformComponent(data.components),
            custom_id: data.customID
          }
        : data.type ===
          InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT
        ? { choices: 'choices' in data ? data.choices : [] }
        : isResponseMessage(data)
        ? {
            content: data.content ?? '',
            embeds: data.embeds,
            tts: data.tts ?? false,
            flags,
            allowed_mentions: data.allowedMentions,
            components:
              data.components === undefined
                ? undefined
                : transformComponent(data.components),
            files: data.files ?? []
          }
        : undefined
    }

    if (this._httpRespond !== undefined && this._httpResponded !== true) {
      this._httpResponded = true
      await this._httpRespond(payload)
    } else {
      await this.client.rest.post(
        INTERACTION_CALLBACK(this.id, this.token),
        payload
      )
    }
    this.responded = true

    return this
  }

  /** Defer the Interaction i.e. let the user know bot is processing and will respond later. You only have 15 minutes to edit the response! */
  async defer(ephemeral = false): Promise<this> {
    await this.respond({
      type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE,
      flags: ephemeral ? 1 << 6 : 0
    })
    this.deferred = true
    return this
  }

  /** Reply with a Message to the Interaction */
  async reply(content: string): Promise<this>
  async reply(options: InteractionMessageOptions): Promise<this>
  async reply(
    content: string,
    options: InteractionMessageOptions
  ): Promise<this>
  async reply(
    content: string | InteractionMessageOptions,
    messageOptions?: InteractionMessageOptions
  ): Promise<this> {
    let options: InteractionMessageOptions | undefined =
      typeof content === 'object' ? content : messageOptions
    if (
      typeof content === 'object' &&
      messageOptions !== undefined &&
      options !== undefined
    ) {
      Object.assign(options, messageOptions)
    }
    if (options === undefined) options = {}
    if (typeof content === 'string') Object.assign(options, { content })

    if (this.deferred && this.responded) {
      await this.editResponse({
        content: options.content,
        embeds: options.embeds,
        flags: options.flags,
        allowedMentions: options.allowedMentions,
        components: options.components,
        files: options.files
      })
    } else {
      await this.respond(
        Object.assign(options, {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        })
      )
    }

    return this
  }

  /** Edit the original Interaction response */
  async editResponse(
    data: InteractionMessageOptions | string
  ): Promise<Interaction> {
    if (typeof data === 'string') data = { content: data }
    const url = WEBHOOK_MESSAGE(this.applicationID, this.token, '@original')
    await this.client.rest.patch(url, {
      content: data.content ?? '',
      embeds: data.embeds ?? [],
      flags:
        typeof data.flags === 'object'
          ? data.flags.reduce((p, a) => p | a, 0)
          : data.flags,
      allowed_mentions: data.allowedMentions,
      files: data.files,
      components:
        data.components === undefined
          ? undefined
          : transformComponent(data.components)
    })
    return this
  }

  /** Fetch the Message object of the Interaction Response */
  async fetchResponse(): Promise<Message> {
    const url = WEBHOOK_MESSAGE(this.applicationID, this.token, '@original')
    const message = await this.client.rest.get(url)
    return new Message(
      this.client,
      message,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      this.channel!,
      new User(this.client, message.author)
    )
  }

  /** Respond with a Modal */
  async showModal(modal: InteractionResponseModal): Promise<this> {
    return await this.respond({
      type: InteractionResponseType.MODAL,
      ...modal
    })
  }

  /** Delete the original Interaction Response */
  async deleteResponse(): Promise<this> {
    const url = WEBHOOK_MESSAGE(this.applicationID, this.token, '@original')
    await this.client.rest.delete(url)
    return this
  }

  get url(): string {
    return `https://discord.com/api/v${
      this.client?.rest?.version ?? Constants.DISCORD_API_VERSION
    }/webhooks/${this.applicationID}/${this.token}`
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

    if (option instanceof Embed) {
      option = {
        embeds: [option]
      }
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
      flags:
        ((option as WebhookMessageOptions)?.flags ?? 0) |
        ((option as WebhookMessageOptions)?.ephemeral === true ? 64 : 0),
      components:
        (option as WebhookMessageOptions)?.components === undefined
          ? undefined
          : typeof (option as WebhookMessageOptions).components === 'function'
          ? (option as { components: CallableFunction }).components()
          : transformComponent(
              (option as { components: MessageComponentData[] }).components
            ),
      username: undefined as undefined | string,
      avatar: undefined as undefined | string
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
    ) {
      throw new Error(
        `Cannot send more than 10 embeds through Interaction Webhook`
      )
    }

    const resp = await this.client.rest.post(`${this.url}?wait=true`, payload)

    const res = new Message(
      this.client,
      resp,
      this as unknown as TextChannel,
      this as unknown as User
    )
    await res.mentions.fromPayload(resp)
    return res
  }

  /** Edit a Followup message */
  async editMessage(
    msg: Message | string,
    data: {
      content?: string
      components?: MessageComponentData[]
      embeds?: Array<Embed | EmbedPayload>
      file?: MessageAttachment
      allowed_mentions?: {
        parse?: string
        roles?: string[]
        users?: string[]
        everyone?: boolean
      }
    }
  ): Promise<this> {
    const payload: Record<string, unknown> = { ...data }

    if (data.components !== undefined) {
      payload.components = transformComponent(data.components)
    }

    await this.client.rest.patch(
      WEBHOOK_MESSAGE(
        this.applicationID,
        this.token ?? this.client.token,
        typeof msg === 'string' ? msg : msg.id
      ),
      data
    )
    return this
  }

  /** Delete a follow-up Message */
  async deleteMessage(msg: Message | string): Promise<this> {
    await this.client.rest.delete(
      WEBHOOK_MESSAGE(
        this.applicationID,
        this.token ?? this.client.token,
        typeof msg === 'string' ? msg : msg.id
      )
    )
    return this
  }
}
