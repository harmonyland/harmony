import { Dict } from '../utils/dict.ts'
import {
  AllowedMentionsPayload,
  ChannelTypes,
  EmbedPayload
} from './channel.ts'
import { MemberPayload } from './guild.ts'
import { RolePayload } from './role.ts'
import { UserPayload } from './user.ts'

export interface InteractionApplicationCommandOption {
  /** Option name */
  name: string
  /** Type of Option */
  type: SlashCommandOptionType
  /** Value of the option */
  value?: any
  /** Sub options */
  options?: InteractionApplicationCommandOption[]
}

export interface InteractionChannelPayload {
  id: string
  name: string
  permissions: string
  type: ChannelTypes
}

export interface InteractionApplicationCommandResolvedPayload {
  users?: Dict<UserPayload>
  members?: Dict<MemberPayload>
  channels?: Dict<InteractionChannelPayload>
  roles?: Dict<RolePayload>
}

export interface InteractionApplicationCommandData {
  /** Name of the Slash Command */
  name: string
  /** Unique ID of the Slash Command */
  id: string
  /** Options (arguments) sent with Interaction */
  options: InteractionApplicationCommandOption[]
  /** Resolved data for options in Slash Command */
  resolved?: InteractionApplicationCommandResolvedPayload
}

export enum InteractionType {
  /** Ping sent by the API (HTTP-only) */
  PING = 1,
  /** Slash Command Interaction */
  APPLICATION_COMMAND = 2
}

export interface InteractionMemberPayload extends MemberPayload {
  /** Permissions of the Member who initiated Interaction (Guild-only) */
  permissions: string
}

export interface InteractionPayload {
  /** Type of the Interaction */
  type: InteractionType
  /** Token of the Interaction to respond */
  token: string
  /** Member object of user who invoked */
  member?: InteractionMemberPayload
  /** User who initiated Interaction (only in DMs) */
  user?: UserPayload
  /** ID of the Interaction */
  id: string
  /**
   * Data sent with the interaction. Undefined only when Interaction is not Slash Command.*
   */
  data?: InteractionApplicationCommandData
  /** ID of the Guild in which Interaction was invoked */
  guild_id?: string
  /** ID of the Channel in which Interaction was invoked */
  channel_id?: string
  application_id: string
}

export interface SlashCommandChoice {
  /** (Display) name of the Choice */
  name: string
  /** Actual value to be sent in Interaction */
  value: any
}

export enum SlashCommandOptionType {
  /** A sub command that is either a part of a root command or Sub Command Group */
  SUB_COMMAND = 1,
  /** A sub command group that is present in root command's options */
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8
}

export interface SlashCommandOption {
  /** Name of the option. */
  name: string
  /** Description of the Option. Not required in Sub-Command-Group */
  description?: string
  /** Option type */
  type: SlashCommandOptionType
  /** Whether the option is required or not, false by default */
  required?: boolean
  default?: boolean
  /** Optional choices out of which User can choose value */
  choices?: SlashCommandChoice[]
  /** Nested options for Sub-Command or Sub-Command-Groups */
  options?: SlashCommandOption[]
}

/** Represents the Slash Command (Application Command) payload sent for creating/bulk editing. */
export interface SlashCommandPartial {
  /** Name of the Slash Command */
  name: string
  /** Description of the Slash Command */
  description: string
  /** Options (arguments, sub commands or group) of the Slash Command */
  options?: SlashCommandOption[]
}

/** Represents a fully qualified Slash Command (Application Command) payload. */
export interface SlashCommandPayload extends SlashCommandPartial {
  /** ID of the Slash Command */
  id: string
  /** Application ID */
  application_id: string
}

export enum InteractionResponseType {
  /** Just ack a ping, Http-only. */
  PONG = 1,
  /** @deprecated **DEPRECATED:** Do nothing, just acknowledge the Interaction */
  ACKNOWLEDGE = 2,
  /** @deprecated **DEPRECATED:** Send a channel message without "<User> used /<Command> with <Bot>" */
  CHANNEL_MESSAGE = 3,
  /** Send a channel message as response. */
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  /** Let the user know bot is processing ("thinking") and you can edit the response later */
  DEFERRED_CHANNEL_MESSAGE = 5
}

export interface InteractionResponsePayload {
  /** Type of the response */
  type: InteractionResponseType
  /** Data to be sent with response. Optional for types: Pong, Acknowledge, Ack with Source */
  data?: InteractionResponseDataPayload
}

export interface InteractionResponseDataPayload {
  tts?: boolean
  /** Text content of the Response (Message) */
  content: string
  /** Upto 10 Embed Objects to send with Response */
  embeds?: EmbedPayload[]
  /** Allowed Mentions object */
  allowed_mentions?: AllowedMentionsPayload
  flags?: number
}

export enum InteractionResponseFlags {
  /** A Message which is only visible to Interaction User. */
  EPHEMERAL = 1 << 6
}
