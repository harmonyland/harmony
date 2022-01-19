import {
  GuildThreadChannelPayload,
  ThreadMemberPayload,
} from "../channels/thread.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { GuildFeature } from "./guild.ts";

export interface GuildPreviewPayload {
  id: string;
  name: string;
  icon: string | null;
  splash: string | null;
  discovery_splash: string | null;
  emojis: EmojiPayload[];
  features: GuildFeature[];
  approximate_member_count: number;
  approximate_presence_count: number;
  description: string | null;
}

export interface GuildWidgetPayload {
  enabled: boolean;
  channel_id: string | null;
}

export interface WelcomeScreenChannelPayload {
  channel_id: string;
  description: string;
  emoji_id: string | null;
  emoji_name: string | null;
}

export interface WelcomeScreenPayload {
  description: string | null;
  welcome_channels: WelcomeScreenChannelPayload[];
}

export interface ActiveThreadsPayload {
  threads: GuildThreadChannelPayload[];
  members: ThreadMemberPayload[];
}

export interface GetGuildPruneCountParams {
  days?: number;
  include_roles?: string[];
}

export interface BeginGuildPrunePayload {
  days?: number;
  compute_prune_count?: boolean;
  include_roles?: string[];
  reason?: string;
}

type GuildWidgetImageStyle =
  | "shield"
  | "banner1"
  | "banner2"
  | "banner3"
  | "banner4";

export interface GetGuildWidgetImageParams {
  style: GuildWidgetImageStyle;
}

export interface EditWelcomeScreenPayload {
  enabled?: boolean | null;
  welcome_channels?: WelcomeScreenChannelPayload[] | null;
  description?: string | null;
}

export interface EditCurrentUserVoiceStatePayload {
  channel_id: string;
  suppress?: boolean;
  request_to_speak_timestamp?: string | null;
}

export interface EditUserVoiceStatePayload {
  channel_id: string;
  suppress?: boolean;
}
