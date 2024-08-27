import { snowflake } from "../common.ts";
import { GuildPayload } from "../guilds/guild.ts";
import { UserPayload } from "../users/user.ts";

export interface GuildTemplatePayload {
  code: string;
  created_at: string;
  creator: UserPayload;
  creator_id: snowflake;
  description: null | string;
  is_dirty: boolean | null;
  name: string;
  serialized_source_guild: GuildPayload;
  source_guild_id: snowflake;
  updated_at: string;
  usage_count: number;
}

export interface CreateGuildFromGuildTemplatePayload {
  icon?: string;
  name: string;
}

export interface CreateGuildTemplatePayload {
  description?: null | string;
  name: string;
}

export interface EditGuildTemplatePayload {
  description?: null | string;
  name?: string;
}
