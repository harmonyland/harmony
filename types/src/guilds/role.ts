import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";

export interface RoleTagsPayload {
  bot_id?: snowflake;
  integration_id?: snowflake;
  premium_subscriber: null;
}

export interface RolePayload {
  id: snowflake;
  name: string;
  color: number;
  hoist: boolean;
  icon?: string | null;
  unicode_emoji?: string | null;
  position: number;
  permissions: string;
  managed: boolean;
  tags?: RoleTagsPayload;
}

export interface CreateGuildRolePayload extends Reasonable {
  name?: string;
  permissions?: string;
  color?: number;
  hoist?: boolean;
  icon?: string | null;
  unicode_emoji?: string | null;
  mentionable?: boolean;
}

export interface EditGuildRolePositionPayload extends Reasonable {
  id: snowflake;
  position?: number | null;
}

export interface EditGuildRolePayload extends Reasonable {
  name?: string | null;
  permissions?: string | null;
  color?: number | null;
  hoist?: boolean | null;
  icon?: string | null;
  unicode_emoji?: string | null;
  mentionable?: boolean | null;
}
