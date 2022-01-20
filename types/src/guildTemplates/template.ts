import { GuildPayload } from "../guilds/guild.ts";

export interface GuildTemplatePayload {
  code: string;
  name: string;
  description: string | null;
  usage_count: number;
  creator_id: string;
  // creator: UserPayload
  created_at: string;
  updated_at: string;
  source_guild_id: string;
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
