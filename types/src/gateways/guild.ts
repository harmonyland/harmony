import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { RolePayload } from "../guilds/role.ts";
import { StickerPayload } from "../stickers/sticker.ts";
import { UserPayload } from "../users/user.ts";
import { EditGatewayPresencePayload } from "./gateway.ts";

export interface GatewayGuildBanAddPayload {
  guild_id: snowflake;
  user: UserPayload;
}

export type GatewayGuildBanRemovePayload = GatewayGuildBanAddPayload;

export interface GatewayGuildEmojisUpdatePayload {
  emojis: EmojiPayload[];
  guild_id: snowflake;
}

export interface GatewayGuildStickersUpdatePayload {
  guild_id: snowflake;
  stickers: StickerPayload[];
}

export interface GatewayGuildIntegrationsUpdatePayload {
  guild_id: snowflake;
}

export interface GatewayGuildMemberAddPayload extends GuildMemberPayload {
  guild_id: snowflake;
}

export interface GatewayGuildMemberRemovePayload {
  guild_id: snowflake;
  user: UserPayload;
}

export interface GatewayGuildMemberUpdatePayload {
  avatar: null | string;
  communication_disabled_until?: null | string;
  deaf?: boolean;
  guild_id: snowflake;
  joined_at: null | string;
  mute?: boolean;
  nick?: null | string;
  pending?: boolean;
  premium_since?: null | string;
  roles: snowflake[];
  user: UserPayload;
}

export interface GatewayGuildMemberChunkPayload {
  chunk_count: number;
  chunk_index: number;
  guild_id: snowflake;
  members: GuildMemberPayload[];
  nonce?: string;
  not_found?: string[];
  presences?: EditGatewayPresencePayload;
}

export interface GatewayGuildRoleCreatePayload {
  guild_id: snowflake;
  role: RolePayload;
}

export type GatewayGuildRoleUpdatePayload = GatewayGuildRoleCreatePayload;

export interface GatewayGuildRoleDeletePayload {
  guild_id: snowflake;
  role_id: snowflake;
}
