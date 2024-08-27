import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { Reasonable } from "../etc/reasonable.ts";

export interface GuildOnboardingPayload {
  default_channel_ids: snowflake[];
  enabled: boolean;
  guild_id: snowflake;
  mode: GuildOnboardingMode;
  prompts: GuildOnboardingPromptPayload[];
}

export enum GuildOnboardingMode {
  ONBOARDING_DEFAULT = 0,
  ONBOARDING_ADVANCED = 1,
}

export interface GuildOnboardingPromptPayload {
  id: snowflake;
  in_onboarding: boolean;
  options: GuildOnboardingPromptOptions;
  required: boolean;
  single_select: boolean;
  title: string;
  type: GuildOnboardingPromptType;
}

export interface GuildOnboardingPromptOptions {
  channel_ids: snowflake[];
  description: null | string;
  emoji?: EmojiPayload;
  emoji_animated?: boolean;
  emoji_id?: snowflake;
  emoji_name?: string;
  id: snowflake;
  role_ids: snowflake[];
  title: string;
}

export enum GuildOnboardingPromptType {
  MULTIPLE_CHOICE = 0,
  DROPDOWN = 1,
}

export interface EditGuildOnboardingPayload extends Reasonable {
  default_channel_ids?: snowflake[];
  enabled?: boolean;
  mode?: GuildOnboardingMode;
  prompts?: GuildOnboardingPromptPayload[];
}
