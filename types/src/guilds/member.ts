import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";

export interface GuildMemberPayload {
  avatar?: null | string;
  communication_disabled_until?: null | string;
  deaf: boolean;
  flags: number;
  joined_at: string;
  mute: boolean;
  nick?: null | string;
  pending?: boolean;
  permissions?: string;
  premium_since?: null | string;
  roles: snowflake[];
  user?: UserPayload;
}

export enum GuildMemberFlags {
  COMPLETED_ONBOARDING = 1 << 1,
  BYPASSES_VERIFICATION = 1 << 2,
  STARTED_ONBOARDING = 1 << 3,
  DID_REJOIN = 1,
}

export interface ListGuildMembersParams {
  after?: snowflake;
  limit?: number;
}

export interface SearchGuildMembersParams {
  limit?: number;
  query: string;
}

export interface AddGuildMemberPayload {
  access_token: string;
  deaf?: boolean;
  mute?: boolean;
  nick?: string;
  roles?: snowflake[];
}

export interface EditGuildMemberPayload extends Reasonable {
  channel_id?: null | snowflake;
  communication_disabled_until?: null | string;
  deaf?: boolean | null;
  flags?: null | number;
  mute?: boolean | null;
  nick?: null | string;
  roles?: null | snowflake[];
}

export interface EditGuildCurrentMemberPayload extends Reasonable {
  nick?: null | string;
}
