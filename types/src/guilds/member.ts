export interface GuildMemberPayload {
  // user?: UserPayload;
  nick?: string | null;
  avatar?: string | null;
  roles: string[];
  joined_at: string;
  premium_since?: string | null;
  deaf: boolean;
  mute: boolean;
  pending?: boolean;
  permissions: string;
  communication_disabled_until?: string | null;
}

export interface ListGuildMembersParams {
  limit?: number;
  after?: string;
}

export interface SearchGuildMembersParams {
  query: string;
  limit?: number;
}

export interface AddGuildMemberPayload {
  access_token: string;
  nick?: string;
  roles?: string[];
  mute?: boolean;
  deaf?: boolean;
}

export interface EditGuildMemberPayload {
  nick?: string | null;
  roles?: string[] | null;
  mute?: boolean | null;
  deaf?: boolean | null;
  channel_id?: string | null;
  communication_disabled_until?: string | null;
}

export interface EditGuildCurrentMemberPayload {
  nick?: string | null;
}
