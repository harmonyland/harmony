import { EmbedPayload } from './channel.ts'
import { MemberPayload } from './guild.ts'

export interface InteractionOption {
  /** Option name */
  name: string
  /** Value of the option */
  value?: any
  /** Sub options */
  options?: any[]
}

export interface InteractionData {
  /** Name of the Slash Command */
  name: string
  /** Unique ID of the Slash Command */
  id: string
  /** Options (arguments) sent with Interaction */
  options: InteractionOption[]
}

export enum InteractionType {
  /** Ping sent by the API (HTTP-only) */
  PING = 1,
  /** Slash Command Interaction */
  APPLICATION_COMMAND = 2
}

export interface InteractionPayload {
  /** Type of the Interaction */
  type: InteractionType
  /** Token of the Interaction to respond */
  token: string
  /** Member object of user who invoked */
  member: MemberPayload & {
    /** Total permissions of the member in the channel, including overrides */
    permissions: string
  }
  /** ID of the Interaction */
  id: string
  /**
   * Data sent with the interaction
   * **This can be undefined only when Interaction is not a Slash Command**
   */
  data: InteractionData
  /** ID of the Guild in which Interaction was invoked */
  guild_id: string
  /** ID of the Channel in which Interaction was invoked */
  channel_id: string
}

export interface SlashCommandChoice {
  /** (Display) name of the Choice */
  name: string
  /** Actual value to be sent in Interaction */
  value: any
}

export enum SlashCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8
}

export interface SlashCommandOption {
  name: string
  /** Description not required in Sub-Command or Sub-Command-Group */
  description?: string
  type: SlashCommandOptionType
  required?: boolean
  default?: boolean
  choices?: SlashCommandChoice[]
  options?: SlashCommandOption[]
}

export interface SlashCommandPartial {
  name: string
  description: string
  options?: SlashCommandOption[]
}

export interface SlashCommandPayload extends SlashCommandPartial {
  id: string
  application_id: string
}

export enum InteractionResponseType {
  /** Just ack a ping, Http-only. */
  PONG = 1,
  /** Do nothing, just acknowledge the Interaction */
  ACKNOWLEDGE = 2,
  /** Send a channel message without "<User> used /<Command> with <Bot>" */
  CHANNEL_MESSAGE = 3,
  /** Send a channel message with "<User> used /<Command> with <Bot>" */
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  /** Send nothing further, but send "<User> used /<Command> with <Bot>" */
  ACK_WITH_SOURCE = 5
}

export interface InteractionResponsePayload {
  type: InteractionResponseType
  data?: InteractionResponseDataPayload
}

export interface InteractionResponseDataPayload {
  tts?: boolean
  content: string
  embeds?: EmbedPayload[]
  allowed_mentions?: {
    parse?: 'everyone' | 'users' | 'roles'
    roles?: string[]
    users?: string[]
  }
  flags?: number
}

export enum InteractionResponseFlags {
  /** A Message which is only visible to Interaction User, and is not saved on backend */
  EPHEMERAL = 1 << 6
}
