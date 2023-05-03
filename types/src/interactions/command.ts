import { ChannelType } from "../channels/base.ts";
import { Locales } from "../etc/locales.ts";

export interface ApplicationCommandPayload {
  id: string;
  type?: ApplicationCommandType;
  application_id: string;
  guild_id?: string;
  name: string;
  name_localizations?: Record<Locales, string | null>;
  description: string;
  description_localizations?: Record<Locales, string | null>;
  options?: ApplicationCommandOptionPayload[];
  default_member_permissions: string | null;
  dm_permission?: boolean;
  nsfw?: boolean;
  version: string;
}

export enum ApplicationCommandType {
  CHAT_INPUT = 1,
  USER = 2,
  MESSAGE = 3,
}

export interface ApplicationCommandOptionPayload {
  type: ApplicationCommandOptionType;
  name: string;
  name_localizations?: Record<Locales, string | null>;
  description: string;
  description_localizations?: Record<Locales, string | null>;
  required?: boolean;
  choices?: ApplicationCommandOptionChoicePayload[];
  options?: ApplicationCommandOptionPayload[];
  channel_types?: ChannelType[];
  min_value?: number;
  max_value?: number;
  min_length?: number;
  max_length?: number;
  autocomplete?: boolean;
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
  name_localizations?: Record<Locales, string | null>;
  value: string | number;
}

export interface ApplicationCommandInteractionDataOptionPayload {
  name: string;
  type: ApplicationCommandOptionType;
  value?: string | number;
  options?: ApplicationCommandInteractionDataOptionPayload[];
  focused?: boolean;
}

export interface GuildApplicationCommandPermissionPayload {
  id: string;
  application_id: string;
  guild_id: string;
  permissions: ApplicationCommandPermissions[];
}

export interface ApplicationCommandPermissions {
  id: string;
  type: ApplicationCommandPermissionType;
  permission: boolean;
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
  name: string;
  name_localizations?: Record<Locales, string | null>;
  description: string;
  description_localizations?: Record<Locales, string | null>;
  options?: ApplicationCommandOptionPayload[];
  default_member_permissions?: string | null;
  dm_permission?: boolean;
  type?: ApplicationCommandType;
  nsfw?: boolean;
}

export interface EditGlobalApplicationCommandPayload {
  name?: string;
  name_localizations?: Record<Locales, string | null>;
  description?: string;
  description_localizations?: Record<Locales, string | null>;
  options?: ApplicationCommandOptionPayload[];
  default_member_permissions?: string | null;
  dm_permission?: boolean;
  nsfw?: boolean;
}

export type BulkOverwriteGlobalApplicationCommandsPayload =
  CreateGlobalApplicationCommandPayload[];

export interface CreateGuildApplicationCommandPayload {
  name: string;
  name_localizations?: Record<Locales, string | null>;
  description: string;
  description_localizations?: Record<Locales, string | null>;
  options?: ApplicationCommandOptionPayload[];
  default_member_permissions?: string | null;
  type?: ApplicationCommandType;
  nsfw?: boolean;
}

export interface EditGuildApplicationCommandPayload {
  name?: string;
  name_localizations?: Record<Locales, string | null>;
  description?: string;
  description_localizations?: Record<Locales, string | null>;
  options?: ApplicationCommandOptionPayload[];
  default_member_permissions?: string | null;
  nsfw?: boolean;
}

export interface BulkOverwriteGuildApplicationCommandsPayload {
  id?: string;
  name: string;
  name_localizations?: Record<Locales, string | null>;
  description: string;
  description_localizations?: Record<Locales, string | null>;
  options?: ApplicationCommandOptionPayload[];
  default_member_permissions?: string | null;
  dm_permission?: boolean | null;
  type?: ApplicationCommandType;
  nsfw?: boolean;
}

export interface EditApplicationCommandPermissionsPayload {
  permissions: ApplicationCommandPermissions[];
}
