import type { Dict } from '../utils/dict.ts'
import type { ChannelTypes } from './channel.ts'
import type { MemberPayload } from './guild.ts'
import type { RolePayload } from './role.ts'
import type { UserPayload } from './user.ts'

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
