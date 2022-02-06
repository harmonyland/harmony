import { ChannelType } from "../channels/base.ts";

export interface ApplicationCommandPayload {
  id: string;
  type?: ApplicationCommandType;
  application_id: string;
  guild_id?: string;
  name: string;
  description: string;
  options?: ApplicationCommandOptionPayload[];
  default_permission?: boolean;
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
  description: string;
  required?: boolean;
  choices?: ApplicationCommandOptionChoicePayload[];
  options?: ApplicationCommandOptionPayload[];
  channel_types?: ChannelType[];
  min_value?: number;
  max_value?: number;
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
}

export interface ApplicationCommandOptionChoicePayload {
  name: string;
  value: string | number;
}

export interface ApplicationCommandInteractionDataOptionPayload {
  name: string;
  type: ApplicationCommandOptionType;
  value?: string | number;
  options: ApplicationCommandInteractionDataOptionPayload[];
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
}

export interface CreateGlobalApplicationCommandPayload {
  name: string;
  description: string;
  options?: ApplicationCommandOptionPayload[];
  default_permission?: boolean;
  type?: ApplicationCommandType;
}

export interface EditGlobalApplicationCommandPayload {
  name?: string;
  description?: string;
  options?: ApplicationCommandOptionPayload[];
  default_permission?: boolean;
}

export interface CreateGuildApplicationCommandPayload {
  name: string;
  description: string;
  options?: ApplicationCommandOptionPayload[];
  default_permission?: boolean;
  type?: ApplicationCommandType;
}

export interface EditGuildApplicationCommandPayload {
  name?: string;
  description?: string;
  options?: ApplicationCommandOptionPayload[];
  default_permission?: boolean;
}

export interface EditApplicationCommandPermissionsPayload {
  permissions: ApplicationCommandPermissions[];
}
