import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { Reasonable } from "../etc/reasonable.ts";

export interface GuildOnboardingPayload {
  guild_id: snowflake;
  prompts: GuildOnboardingPromptPayload[];
  default_channel_ids: snowflake[];
  enabled: boolean;
  mode: GuildOnboardingMode;
}

export enum GuildOnboardingMode {
  ONBOARDING_DEFAULT = 0,
  ONBOARDING_ADVANCED = 1,
}

export interface GuildOnboardingPromptPayload {
  id: snowflake;
  type: GuildOnboardingPromptType;
  options: GuildOnboardingPromptOptions;
  title: string;
  single_select: boolean;
  required: boolean;
  in_onboarding: boolean;
}

export interface GuildOnboardingPromptOptions {
  id: snowflake;
  channel_ids: snowflake[];
  role_ids: snowflake[];
  emoji?: EmojiPayload;
  emoji_id?: snowflake;
  emoji_name?: string;
  emoji_animated?: boolean;
  title: string;
  description: string | null;
}

export enum GuildOnboardingPromptType {
  MULTIPLE_CHOICE = 0,
  DROPDOWN = 1,
}

export interface EditGuildOnboardingPayload extends Reasonable {
  prompts?: GuildOnboardingPromptPayload[];
  default_channel_ids?: snowflake[];
  enabled?: boolean;
  mode?: GuildOnboardingMode;
}
