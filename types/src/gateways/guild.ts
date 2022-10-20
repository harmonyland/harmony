import { EmojiPayload } from "../emojis/emoij.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { RolePayload } from "../guilds/role.ts";
import { StickerPayload } from "../stickers/sticker.ts";
import { UserPayload } from "../users/user.ts";
import { EditGatewayPresencePayload } from "./gateway.ts";

export interface GatewayGuildBanAddPayload {
  guild_id: string;
  user: UserPayload;
}

export type GatewayGuildBanRemovePayload = GatewayGuildBanAddPayload;

export interface GatewayGuildEmojisUpdatePayload {
  guild_id: string;
  emojis: EmojiPayload[];
}

export interface GatewayGuildStickersUpdatePayload {
  guild_id: string;
  stickers: StickerPayload[];
}

export interface GatewayGuildIntegrationsUpdatePayload {
  guild_id: string;
}

export interface GatewayGuildMemberAddPayload extends GuildMemberPayload {
  guild_id: string;
}

export interface GatewayGuildMemberRemovePayload {
  user: UserPayload;
}

export interface GatewayGuildMemberUpdatePayload {
  guild_id: string;
  roles: string[];
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
  guild_id: string;
  members: GuildMemberPayload[];
  chunk_index: number;
  chunk_count: number;
  not_found?: string[];
  presences?: EditGatewayPresencePayload;
  nonce?: string;
}

export interface GatewayGuildRoleCreatePayload {
  guild_id: string;
  role: RolePayload;
}

export type GatewayGuildRoleUpdatePayload = GatewayGuildRoleCreatePayload;

export interface GatewayGuildRoleDeletePayload {
  guild_id: string;
  role_id: string;
}
