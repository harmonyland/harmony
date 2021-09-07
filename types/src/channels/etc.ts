// deno-lint-ignore-file camelcase

export interface FollowedChannelPayload {
  channel_id: string;
  webhook_id: string;
}

export enum AllowedMentionType {
  ROLES = "roles",
  USERS = "users",
  EVERYONE = "everyone",
}

export interface AllowedMentionsPayload {
  parse: AllowedMentionType[];
  roles: string[];
  users: string[];
  replied_user: boolean;
}
