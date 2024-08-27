import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";

export interface RoleTagsPayload {
  bot_id?: snowflake;
  integration_id?: snowflake;
  premium_subscriber: null;
}

export interface RolePayload {
  color: number;
  hoist: boolean;
  icon?: null | string;
  id: snowflake;
  managed: boolean;
  name: string;
  permissions: string;
  position: number;
  tags?: RoleTagsPayload;
  unicode_emoji?: null | string;
}

export interface CreateGuildRolePayload extends Reasonable {
  color?: number;
  hoist?: boolean;
  icon?: null | string;
  mentionable?: boolean;
  name?: string;
  permissions?: string;
  unicode_emoji?: null | string;
}

export interface EditGuildRolePositionPayload extends Reasonable {
  id: snowflake;
  position?: null | number;
}

export interface EditGuildRolePayload extends Reasonable {
  color?: null | number;
  hoist?: boolean | null;
  icon?: null | string;
  mentionable?: boolean | null;
  name?: null | string;
  permissions?: null | string;
  unicode_emoji?: null | string;
}
