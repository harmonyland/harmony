import { ApplicationIntegrationType } from "../applications/application.ts";
import { ChannelType } from "../channels/base.ts";
import { snowflake } from "../common.ts";
import { Locales } from "../etc/locales.ts";

export interface ApplicationCommandPayload {
  application_id: snowflake;
  contexts?: ApplicationCommandContextType[] | null;
  default_member_permissions: null | string;
  default_permission?: boolean | null;
  description: string;
  description_localizations?: Record<Locales, null | string>;
  dm_permission?: boolean;
  guild_id?: snowflake;
  id: snowflake;
  integration_types?: ApplicationIntegrationType[];
  name: string;
  name_localizations?: Record<Locales, null | string>;
  nsfw?: boolean;
  options?: ApplicationCommandOptionPayload[];
  type?: ApplicationCommandType;
  version: snowflake;
}

export enum ApplicationCommandContextType {
  GUILD = 0,
  BOT_DM = 1,
  PRIVATE_CHANNEL = 2,
}

export enum ApplicationCommandType {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3,
}

export interface ApplicationCommandOptionPayload {
  autocomplete?: boolean;
  channel_types?: ChannelType[];
  choices?: ApplicationCommandOptionChoicePayload[];
  description: string;
  description_localizations?: Record<Locales, null | string>;
  max_length?: number;
  max_value?: number;
  min_length?: number;
  min_value?: number;
  name: string;
  name_localizations?: Record<Locales, null | string>;
  options?: ApplicationCommandOptionPayload[];
  required?: boolean;
  type: ApplicationCommandOptionType;
}

export enum ApplicationCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9,
  NUMBER = 10,
  ATTACHMENT = 11,
}

export interface ApplicationCommandOptionChoicePayload {
  name: string;
  name_localizations?: Record<Locales, null | string>;
  value: number | string;
}

export interface ApplicationCommandInteractionDataOptionPayload {
  focused?: boolean;
  name: string;
  options?: ApplicationCommandInteractionDataOptionPayload[];
  type: ApplicationCommandOptionType;
  value?: number | string;
}

export interface GuildApplicationCommandPermissionPayload {
  application_id: snowflake;
  guild_id: snowflake;
  id: snowflake;
  permissions: ApplicationCommandPermissions[];
}

export interface ApplicationCommandPermissions {
  id: snowflake;
  permission: boolean;
  type: ApplicationCommandPermissionType;
}

export enum ApplicationCommandPermissionType {
  ROLE = 1,
  USER = 2,
  CHANNEL = 3,
}

export interface GetGlobalApplicationCommandsParams {
  with_localizations?: boolean;
}

export type GetGuildApplicationCommandsParams =
  GetGlobalApplicationCommandsParams;

export interface CreateGlobalApplicationCommandPayload {
  contexts?: ApplicationCommandContextType[];
  default_member_permissions?: null | string;
  default_permission?: boolean;
  description: string;
  description_localizations?: Record<Locales, null | string>;
  dm_permission?: boolean | null;
  integration_types?: ApplicationIntegrationType[];
  name: string;
  name_localizations?: Record<Locales, null | string>;
  nsfw?: boolean;
  options?: ApplicationCommandOptionPayload[];
  type?: ApplicationCommandType;
}

export interface EditGlobalApplicationCommandPayload {
  contexts?: ApplicationCommandContextType[];
  default_member_permissions?: null | string;
  default_permission?: boolean;
  description?: string;
  description_localizations?: Record<Locales, null | string>;
  dm_permission?: boolean | null;
  integration_types?: ApplicationIntegrationType[];
  name?: string;
  name_localizations?: Record<Locales, null | string>;
  nsfw?: boolean;
  options?: ApplicationCommandOptionPayload[];
}

export type BulkOverwriteGlobalApplicationCommandsPayload =
  CreateGlobalApplicationCommandPayload[];

export interface CreateGuildApplicationCommandPayload {
  default_member_permissions?: null | string;
  default_permission?: boolean;
  description: string;
  description_localizations?: Record<Locales, null | string>;
  name: string;
  name_localizations?: Record<Locales, null | string>;
  nsfw?: boolean;
  options?: ApplicationCommandOptionPayload[];
  type?: ApplicationCommandType;
}

export interface EditGuildApplicationCommandPayload {
  default_member_permissions?: null | string;
  default_permission?: boolean;
  description?: string;
  description_localizations?: Record<Locales, null | string>;
  name?: string;
  name_localizations?: Record<Locales, null | string>;
  nsfw?: boolean;
  options?: ApplicationCommandOptionPayload[];
}

export interface BulkOverwriteGuildApplicationCommandsPayload {
  contexts?: ApplicationCommandContextType[];
  default_member_permissions?: null | string;
  default_permission?: boolean;
  description: string;
  description_localizations?: Record<Locales, null | string>;
  dm_permission?: boolean | null;
  id?: snowflake;
  integration_types?: ApplicationIntegrationType[];
  name: string;
  name_localizations?: Record<Locales, null | string>;
  nsfw?: boolean;
  options?: ApplicationCommandOptionPayload[];
  type?: ApplicationCommandType;
}

export interface EditApplicationCommandPermissionsPayload {
  permissions: ApplicationCommandPermissions[];
}
