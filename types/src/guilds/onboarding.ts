import { EmojiPayload } from "../emojis/emoij.ts";

export interface GuildOnboardingPayload {
  guild_id: string;
  prompts: GuildOnboardingPromptPayload[];
  default_channel_ids: string[];
  enabled: boolean;
}

export interface GuildOnboardingPromptPayload {
  id: string;
  type: GuildOnboardingPromptType;
  options: GuildOnboardingPromptOptions;
  title: string;
  single_select: boolean;
  required: boolean;
  in_onboarding: boolean;
}

export interface GuildOnboardingPromptOptions {
  id: string;
  channel_ids: string[];
  role_ids: string[];
  emoji: EmojiPayload;
  title: string;
  description: string | null;
}

export enum GuildOnboardingPromptType {
  MULTIPLE_CHOICE = 0,
  DROPDOWN = 1,
}
