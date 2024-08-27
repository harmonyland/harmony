import { snowflake } from "../common.ts";

/** @link https://discord.com/developers/docs/resources/channel#followed-channel-object-followed-channel-structure */
export interface FollowedChannelPayload {
  channel_id: snowflake;
  webhook_id: snowflake;
}

/** @link https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types */
export enum AllowedMentionType {
  EVERYONE = "everyone",
  ROLES = "roles",
  USERS = "users",
}

/** @link https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mentions-structure */
export interface AllowedMentionsPayload {
  parse: AllowedMentionType[];
  replied_user: boolean;
  roles: snowflake[];
  users: snowflake[];
}
