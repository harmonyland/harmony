import type { Dict } from '../utils/dict.ts'
import type { ChannelTypes, MessagePayload } from './channel.ts'
import type { MemberPayload } from './guild.ts'
import type { RolePayload } from './role.ts'
import type { UserPayload } from './user.ts'

export interface InteractionApplicationCommandOption {
  /** Option name */
  name: string
  /** Type of Option */
  type: ApplicationCommandOptionType
  /** Value of the option */
  value?: any
  /** Sub options */
  options?: InteractionApplicationCommandOption[]
  /** Whether this option was focused in Autocomplete Interaction */
  focused?: boolean
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

export interface ApplicationCommandChoice {
  /** (Display) name of the Choice */
  name: string
  /** Actual value to be sent in Interaction Slash Command Data */
  value: any
}

export type { ApplicationCommandChoice as SlashCommandChoice }

export enum ApplicationCommandOptionType {
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
  /** Number option type, similar to JS Number. Can be both integer and float */
  NUMBER = 10,
  /** Attachment option type */
  ATTACHMENT = 11
}

export { ApplicationCommandOptionType as SlashCommandOptionType }

export interface ApplicationCommandOptionBase<
  T = unknown,
  OptionType = ApplicationCommandOptionType
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
  choices?: ApplicationCommandChoice[]
  /** Nested options for Sub-Command or Sub-Command-Groups */
  options?: T[]
  /** Whether this Option supports realtime autocomplete */
  autocomplete?: boolean
}

export type { ApplicationCommandOptionBase as SlashCommandOptionBase }

export interface ApplicationCommandOptionPayload
  extends ApplicationCommandOptionBase<
    ApplicationCommandOptionPayload,
    ApplicationCommandOptionType
  > {
  channel_types?: ChannelTypes[]
  min_value?: number
  max_value?: number
}

export type { ApplicationCommandOptionPayload as SlashCommandOptionPayload }

export interface ApplicationCommandOption
  extends ApplicationCommandOptionBase<
    ApplicationCommandOption,
    ApplicationCommandOptionType | keyof typeof ApplicationCommandOptionType
  > {
  channelTypes?: Array<ChannelTypes | keyof typeof ChannelTypes>
  minValue?: number
  maxValue?: number
}

export type { ApplicationCommandOption as SlashCommandOption }

export enum ApplicationCommandType {
  /** Slash Command which user types in Chat Input */
  CHAT_INPUT = 1,
  /** Command triggered from the User Context Menu */
  USER = 2,
  /** Command triggered from the Message Content Menu */
  MESSAGE = 3
}

/** Represents the Slash Command (Application Command) payload sent for creating/[bulk] editing. */
export interface ApplicationCommandPartialBase<
  T = ApplicationCommandOptionPayload,
  T2 = ApplicationCommandType
> {
  /** Name of the Application Command */
  name: string
  /** Description of the Slash Command. Not applicable to Context Menu commands. */
  description?: string
  /** Options (arguments, sub commands or group) of the Slash Command. Not applicable to Context Menu commands. */
  options?: T[]
  /** Type of the Application Command */
  type?: T2
}

export type { ApplicationCommandPartialBase as SlashCommandPartialBase }

export interface ApplicationCommandPartialPayload
  extends ApplicationCommandPartialBase {
  default_permission?: boolean
}

export type { ApplicationCommandPartialPayload as SlashCommandPartialPayload }

export interface ApplicationCommandPartial
  extends ApplicationCommandPartialBase<
    ApplicationCommandOption,
    ApplicationCommandType | keyof typeof ApplicationCommandType
  > {
  defaultPermission?: boolean
}

export type { ApplicationCommandPartial as SlashCommandPartial }

/** Represents a fully qualified Application Command payload. */
export interface ApplicationCommandPayload
  extends ApplicationCommandPartialPayload {
  /** ID of the Application Command */
  id: string
  /** Application ID */
  application_id: string
  guild_id?: string
  default_permission: boolean
  type: ApplicationCommandType
  options: ApplicationCommandOptionPayload[]
}

export type { ApplicationCommandPayload as SlashCommandPayload }

export enum ApplicationCommandPermissionType {
  ROLE = 1,
  USER = 2
}

export { ApplicationCommandPermissionType as SlashCommandPermissionType }

export interface GuildApplicationCommmandPermissionsBase<
  T = ApplicationCommandPermissionPayload
> {
  id: string
  permissions: T[]
}

export type { GuildApplicationCommmandPermissionsBase as GuildSlashCommandPermissionsBase }

export interface GuildApplicationCommmandPermissionsPartial
  extends GuildApplicationCommmandPermissionsBase<ApplicationCommandPermission> {}

export type { GuildApplicationCommmandPermissionsPartial as GuildSlashCommmandPermissionsPartial }

export interface GuildApplicationCommmandPermissionsPayload
  extends GuildApplicationCommmandPermissionsBase {
  application_id: string
  guild_id: string
}

export type { GuildApplicationCommmandPermissionsPayload as GuildSlashCommmandPermissionsPayload }

export interface GuildApplicationCommandPermissions
  extends GuildApplicationCommmandPermissionsPartial {
  applicationID: string
  guildID: string
}

export type { GuildApplicationCommandPermissions as GuildSlashCommandPermissions }

export interface ApplicationCommandPermissionBase<
  T = ApplicationCommandPermissionType
> {
  id: string
  type: T
  permission: boolean
}

export type { ApplicationCommandPermissionBase as SlashCommandPermissionBase }

export interface ApplicationCommandPermission
  extends ApplicationCommandPermissionBase<
    | ApplicationCommandPermissionType
    | keyof typeof ApplicationCommandPermissionType
  > {}

export type { ApplicationCommandPermission as SlashCommandPermission }

export interface ApplicationCommandPermissionPayload
  extends ApplicationCommandPermissionBase {}

export type { ApplicationCommandPermissionPayload as SlashCommandPermissionPayload }
