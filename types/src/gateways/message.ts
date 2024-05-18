import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { GuildMemberPayload } from "../guilds/member.ts";

export interface GatewayMessageDeletePayload {
  id: snowflake;
  channel_id: snowflake;
  guild_id?: snowflake;
}

export interface GatewayMessageDeleteBulkPayload {
  ids: snowflake;
  channel_id: snowflake;
  guild_id?: snowflake;
}

export interface GatewayMessageReactionAddPayload {
  user_id: snowflake;
  channel_id: snowflake;
  message_id: snowflake;
  guild_id?: snowflake;
  member?: GuildMemberPayload;
  emoji: EmojiPayload;
  message_author_id?: snowflake;
}
export type GatewayMessageReactionRemovePayload = Omit<
  GatewayMessageReactionAddPayload,
  "member" | "message_author_id"
>;

export interface GatewayMessageReactionRemoveAllPayload {
  channel_id: snowflake;
  message_id: snowflake;
  guild_id?: snowflake;
}

export interface GatewayMessageReactionRemoveEmojiPayload
  extends GatewayMessageReactionRemoveAllPayload {
  emoji: EmojiPayload;
}
