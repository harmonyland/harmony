import type { Dict } from '../utils/dict.ts'
import type { ChannelTypes, MessagePayload } from './channel.ts'
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
  messages?: Dict<MessagePayload>
}

export interface InteractionApplicationCommandData {
  /** Name of the Application Command */
  name: string
  /** Unique ID of the Application Command */
  id: string
  /** Type of the Application Command */
  type: ApplicationCommandType
  /** Options (arguments) sent with Interaction */
  options: InteractionApplicationCommandOption[]
  /** Resolved data for options/targets in Application Command */
  resolved?: InteractionApplicationCommandResolvedPayload
  /** Target ID if Command was targeted to something through Context Menu, for example User, Message, etc. */
  target_id?: string
}

export interface SlashCommandChoice {
  /** (Display) name of the Choice */
  name: string
  /** Actual value to be sent in Interaction Slash Command Data */
  value: any
}

export enum SlashCommandOptionType {
  /** A sub command that is either a part of a root command or Sub Command Group */
  SUB_COMMAND = 1,
  /** A sub command group that is present in root command's options */
  SUB_COMMAND_GROUP = 2,
  /** String option type */
  STRING = 3,
  /** Integer option type */
  INTEGER = 4,
  /** Boolean option type */
  BOOLEAN = 5,
  /** User option type */
  USER = 6,
  /** Channel option type */
  CHANNEL = 7,
  /** Role option type */
  ROLE = 8,
  /** Union of User and Role option type */
  MENTIONABLE = 9,
  /** Number option tyoe, similar to JS Number. Can be both integer and float */
  NUMBER = 10
}

export interface SlashCommandOptionBase<
  T = any,
  OptionType = SlashCommandOptionType
> {
  /** Name of the option. */
  name: string
  /** Description of the Option. */
  description: string
  /** Option type */
  type: OptionType
  /** Whether the option is required or not, false by default */
  required?: boolean
  default?: boolean
  /** Optional choices out of which User can choose value */
  choices?: SlashCommandChoice[]
  /** Nested options for Sub-Command or Sub-Command-Groups */
  options?: T[]
}

export interface SlashCommandOptionPayload
  extends SlashCommandOptionBase<
    SlashCommandOptionPayload,
    SlashCommandOptionType
  > {}

export interface SlashCommandOption
  extends SlashCommandOptionBase<
    SlashCommandOption,
    SlashCommandOptionType | keyof typeof SlashCommandOptionType
  > {}

export enum ApplicationCommandType {
  /** Slash Command which user types in Chat Input */
  CHAT_INPUT = 1,
  /** Command triggered from the User Context Menu */
  USER = 2,
  /** Command triggered from the Message Content Menu */
  MESSAGE = 3
}

/** Represents the Slash Command (Application Command) payload sent for creating/[bulk] editing. */
export interface SlashCommandPartialBase<T = SlashCommandOptionPayload, T2 = ApplicationCommandType> {
  /** Name of the Application Command */
  name: string
  /** Description of the Slash Command. Not applicable to Context Menu commands. */
  description?: string
  /** Options (arguments, sub commands or group) of the Slash Command. Not applicable to Context Menu commands. */
  options?: T[]
  /** Type of the Application Command */
  type?: T2
}

export interface SlashCommandPartialPayload extends SlashCommandPartialBase {
  default_permission?: boolean
}

export interface SlashCommandPartial
  extends SlashCommandPartialBase<SlashCommandOption, ApplicationCommandType | keyof typeof ApplicationCommandType> {
  defaultPermission?: boolean
}

/** Represents a fully qualified Slash Command (Application Command) payload. */
export interface SlashCommandPayload extends SlashCommandPartialPayload {
  /** ID of the Slash Command */
  id: string
  /** Application ID */
  application_id: string
  default_permission: boolean
  type: ApplicationCommandType
  options: SlashCommandOptionPayload[]
}

export enum SlashCommandPermissionType {
  ROLE = 1,
  USER = 2
}

export interface GuildSlashCommmandPermissionsBase<
  T = SlashCommandPermissionPayload
> {
  id: string
  permissions: T[]
}

export interface GuildSlashCommmandPermissionsPartial
  extends GuildSlashCommmandPermissionsBase<SlashCommandPermission> {}

export interface GuildSlashCommmandPermissionsPayload
  extends GuildSlashCommmandPermissionsBase {
  application_id: string
  guild_id: string
}

export interface GuildSlashCommandPermissions
  extends GuildSlashCommmandPermissionsPartial {
  applicationID: string
  guildID: string
}

export interface SlashCommandPermissionBase<T = SlashCommandPermissionType> {
  id: string
  type: T
  permission: boolean
}

export interface SlashCommandPermission
  extends SlashCommandPermissionBase<
    SlashCommandPermissionType | keyof typeof SlashCommandPermissionType
  > {}

export interface SlashCommandPermissionPayload
  extends SlashCommandPermissionBase {}
