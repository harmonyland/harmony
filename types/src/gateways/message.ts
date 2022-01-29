import { EmojiPayload } from "../emojis/emoij.ts";
import { GuildMemberPayload } from "../guilds/member.ts";

export interface GatewayMessageDeletePayload {
  id: string;
  channel_id: string;
  guild_id?: string;
}

export interface GatewayMessageDeleteBulkPayload {
  ids: string;
  channel_id: string;
  guild_id?: string;
}

export interface GatewayMessageReactionAddPayload {
  user_id: string;
  channel_id: string;
  message_id: string;
  guild_id?: string;
  member?: GuildMemberPayload;
  emoji: EmojiPayload;
}
export type GatewayMessageReactionRemovePayload = Omit<
  GatewayMessageReactionAddPayload,
  "member"
>;

export interface GatewayMessageReactionRemoveAllPayload {
  channel_id: string;
  message_id: string;
  guild_id?: string;
}

export interface GatewayMessageReactionRemoveEmojiPayload
  extends GatewayMessageReactionRemoveAllPayload {
  emoji: EmojiPayload;
}
