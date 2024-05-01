import { snowflake } from "../common.ts";
import { GuildPayload } from "../guilds/guild.ts";
import { UserPayload } from "../users/user.ts";

export interface GuildTemplatePayload {
  code: string;
  name: string;
  description: string | null;
  usage_count: number;
  creator_id: snowflake;
  creator: UserPayload;
  created_at: string;
  updated_at: string;
  source_guild_id: snowflake;
  serialized_source_guild: GuildPayload;
  is_dirty: boolean | null;
}

export interface CreateGuildFromGuildTemplatePayload {
  name: string;
  icon?: string;
}

export interface CreateGuildTemplatePayload {
  name: string;
  description?: string | null;
}

export interface EditGuildTemplatePayload {
  name?: string;
  description?: string | null;
}
