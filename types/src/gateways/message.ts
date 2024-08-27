import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { GuildMemberPayload } from "../guilds/member.ts";

export interface GatewayMessageDeletePayload {
  channel_id: snowflake;
  guild_id?: snowflake;
  id: snowflake;
}

export interface GatewayMessageDeleteBulkPayload {
  channel_id: snowflake;
  guild_id?: snowflake;
  ids: snowflake;
}

export interface GatewayMessageReactionAddPayload {
  channel_id: snowflake;
  emoji: EmojiPayload;
  guild_id?: snowflake;
  member?: GuildMemberPayload;
  message_author_id?: snowflake;
  message_id: snowflake;
  user_id: snowflake;
}
export type GatewayMessageReactionRemovePayload = Omit<
  GatewayMessageReactionAddPayload,
  "member" | "message_author_id"
>;

export interface GatewayMessageReactionRemoveAllPayload {
  channel_id: snowflake;
  guild_id?: snowflake;
  message_id: snowflake;
}

export interface GatewayMessageReactionRemoveEmojiPayload
  extends GatewayMessageReactionRemoveAllPayload {
  emoji: EmojiPayload;
}
