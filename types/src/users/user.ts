import { snowflake } from "../common.ts";

export interface UserPayload {
  accent_color?: null | number;
  avatar: null | string;
  avatar_decoration?: null | string;
  banner?: null | string;
  bot?: boolean;
  discriminator: string;
  email?: null | string;
  flags?: number;
  global_name: null | string;
  id: snowflake;
  locale?: string;
  mfa_enabled?: boolean;
  premium_type?: PremiumType;
  public_flags?: number;
  system?: boolean;
  username: string;
  verified?: boolean;
}

export enum UserFlags {
  STAFF = 1 << 0,
  PARTNER = 1 << 1,
  HYPESQUAD = 1 << 2,
  BUG_HUNTER_LEVEL_1 = 1 << 3,
  HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6,
  HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7,
  HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8,
  PREMIUM_EARLY_SUPPORTER = 1 << 9,
  TEAM_PSEUDO_USER = 1 << 10,
  BUG_HUNTER_LEVEL_2 = 1 << 14,
  VERIFIED_BOT = 1 << 16,
  VERIFIED_DEVELOPER = 1 << 17,
  CERTIFIED_MODERATOR = 1 << 18,
  BOT_HTTP_INTERACTIONS = 1 << 19,
  ACTIVE_DEVELOPER = 1 << 22,
  None = 0,
}

export enum PremiumType {
  NONE = 0,
  NITRO_CLASSIC = 1,
  NITRO = 2,
  NITRO_BASIC = 3,
}

export interface EditCurrentUserPayload {
  avatar?: null | string;
  username?: string;
}

export interface GetCurrentUserGuildsParams {
  after?: snowflake;
  before?: snowflake;
  limit?: number;
  with_counts?: boolean;
}

export interface CreateDMPayload {
  recipient_id: snowflake;
}

export interface CreateGroupDMPayload {
  access_tokens: string[];
  nicks: Record<string, string>;
}
