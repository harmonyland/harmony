import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";

export interface GuildMemberPayload {
  user?: UserPayload;
  nick?: string | null;
  avatar?: string | null;
  roles: snowflake[];
  joined_at: string;
  premium_since?: string | null;
  deaf: boolean;
  mute: boolean;
  flags: number;
  pending?: boolean;
  permissions?: string;
  communication_disabled_until?: string | null;
}

export enum GuildMemberFlags {
  DID_REJOIN = 1,
  COMPLETED_ONBOARDING = 1 << 1,
  BYPASSES_VERIFICATION = 1 << 2,
  STARTED_ONBOARDING = 1 << 3,
}

export interface ListGuildMembersParams {
  limit?: number;
  after?: snowflake;
}

export interface SearchGuildMembersParams {
  query: string;
  limit?: number;
}

export interface AddGuildMemberPayload {
  access_token: string;
  nick?: string;
  roles?: snowflake[];
  mute?: boolean;
  deaf?: boolean;
}

export interface EditGuildMemberPayload extends Reasonable {
  nick?: string | null;
  roles?: snowflake[] | null;
  mute?: boolean | null;
  deaf?: boolean | null;
  channel_id?: snowflake | null;
  communication_disabled_until?: string | null;
  flags?: number | null;
}

export interface EditGuildCurrentMemberPayload extends Reasonable {
  nick?: string | null;
}
