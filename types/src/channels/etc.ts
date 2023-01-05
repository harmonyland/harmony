/** @link https://discord.com/developers/docs/resources/channel#followed-channel-object-followed-channel-structure */
export interface FollowedChannelPayload {
  channel_id: string;
  webhook_id: string;
}

/** @link https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types */
export enum AllowedMentionType {
  ROLES = "roles",
  USERS = "users",
  EVERYONE = "everyone",
}

/** @link https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mentions-structure */
export interface AllowedMentionsPayload {
  parse: AllowedMentionType[];
  roles: string[];
  users: string[];
  replied_user: boolean;
}
