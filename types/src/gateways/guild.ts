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
  guild_id: snowflake;
  emojis: EmojiPayload[];
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
  guild_id: snowflake;
  roles: snowflake[];
  user: UserPayload;
  nick?: string | null;
  avatar: string | null;
  joined_at: string | null;
  premium_since?: string | null;
  deaf?: boolean;
  mute?: boolean;
  pending?: boolean;
  communication_disabled_until?: string | null;
}

export interface GatewayGuildMemberChunkPayload {
  guild_id: snowflake;
  members: GuildMemberPayload[];
  chunk_index: number;
  chunk_count: number;
  not_found?: string[];
  presences?: EditGatewayPresencePayload;
  nonce?: string;
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
