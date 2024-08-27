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
  approximate_member_count: number;
  approximate_presence_count: number;
  description: null | string;
  discovery_splash: null | string;
  emojis: EmojiPayload[];
  features: GuildFeature[];
  icon: null | string;
  id: snowflake;
  name: string;
  splash: null | string;
  stickers: StickerPayload[];
}

export interface GuildWidgetSettingsPayload {
  channel_id: null | snowflake;
  enabled: boolean;
}

export interface GuildWidgetPayload {
  channels: PartialGuildChannelPayload[];
  id: snowflake;
  instant_invite: null | string;
  members: UserPayload[];
  name: string;
  presence_count: number;
}

export interface WelcomeScreenChannelPayload {
  channel_id: snowflake;
  description: string;
  emoji_id: null | snowflake;
  emoji_name: null | string;
}

export interface WelcomeScreenPayload {
  description: null | string;
  welcome_channels: WelcomeScreenChannelPayload[];
}

export interface ActiveThreadsPayload {
  members: ThreadMemberPayload[];
  threads: GuildThreadChannelPayload[];
}

export interface GetGuildPruneCountParams {
  days?: number;
  include_roles?: snowflake[];
}

export interface BeginGuildPrunePayload extends Reasonable {
  compute_prune_count?: boolean;
  days?: number;
  include_roles?: snowflake[];
}

type GuildWidgetImageStyle =
  | "banner1"
  | "banner2"
  | "banner3"
  | "banner4"
  | "shield";

export interface GetGuildWidgetImageParams {
  style?: GuildWidgetImageStyle;
}

export interface EditWelcomeScreenPayload extends Reasonable {
  description?: null | string;
  enabled?: boolean | null;
  welcome_channels?: null | WelcomeScreenChannelPayload[];
}

export interface EditCurrentUserVoiceStatePayload {
  channel_id?: snowflake;
  request_to_speak_timestamp?: null | string;
  suppress?: boolean;
}

export interface EditUserVoiceStatePayload {
  channel_id: snowflake;
  suppress?: boolean;
}

export interface EditGuildMFALevelPayload extends Reasonable {
  level: MFALevel;
}
