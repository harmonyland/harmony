import {
  GuildThreadChannelPayload,
  ThreadMemberPayload,
} from "../channels/thread.ts";
import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { StickerPayload } from "../stickers/sticker.ts";
import { UserPayload } from "../users/user.ts";
import { GuildFeature, MFALevel, PartialGuildChannelPayload } from "./guild.ts";

export interface GuildPreviewPayload {
  id: snowflake;
  name: string;
  icon: string | null;
  splash: string | null;
  discovery_splash: string | null;
  emojis: EmojiPayload[];
  features: GuildFeature[];
  approximate_member_count: number;
  approximate_presence_count: number;
  description: string | null;
  stickers: StickerPayload[];
}

export interface GuildWidgetSettingsPayload {
  enabled: boolean;
  channel_id: snowflake | null;
}

export interface GuildWidgetPayload {
  id: snowflake;
  name: string;
  instant_invite: string | null;
  channels: PartialGuildChannelPayload[];
  members: UserPayload[];
  presence_count: number;
}

export interface WelcomeScreenChannelPayload {
  channel_id: snowflake;
  description: string;
  emoji_id: snowflake | null;
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
  include_roles?: snowflake[];
}

export interface BeginGuildPrunePayload extends Reasonable {
  days?: number;
  compute_prune_count?: boolean;
  include_roles?: snowflake[];
}

type GuildWidgetImageStyle =
  | "shield"
  | "banner1"
  | "banner2"
  | "banner3"
  | "banner4";

export interface GetGuildWidgetImageParams {
  style?: GuildWidgetImageStyle;
}

export interface EditWelcomeScreenPayload extends Reasonable {
  enabled?: boolean | null;
  welcome_channels?: WelcomeScreenChannelPayload[] | null;
  description?: string | null;
}

export interface EditCurrentUserVoiceStatePayload {
  channel_id?: snowflake;
  suppress?: boolean;
  request_to_speak_timestamp?: string | null;
}

export interface EditUserVoiceStatePayload {
  channel_id: snowflake;
  suppress?: boolean;
}

export interface EditGuildMFALevelPayload extends Reasonable {
  level: MFALevel;
}
