export interface RoleTagsPayload {
  bot_id?: string;
  integration_id?: string;
  premium_subscriber: null;
}

export interface RolePayload {
  id: string;
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

export interface CreateGuildRolePayload {
  name: string;
  permissions: string;
  color: number;
  hoist: boolean;
  icon: string | null;
  unicode_emoji: string | null;
  mentionable: boolean;
}

export interface EditGuildRolePositionPayload {
  id: string;
  position?: number | null;
}

export interface EditGuildRolePayload {
  name?: string | null;
  permissions?: string | null;
  color?: number | null;
  hoist?: boolean | null;
  icon?: string | null;
  unicode_emoji?: string | null;
  mentionable?: boolean | null;
}
