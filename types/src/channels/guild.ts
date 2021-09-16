// deno-lint-ignore-file camelcase
// Thread channels are seperated to a different file.
import { ChannelPayload, TextChannelPayload } from "./base.ts";

// https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure
export enum OverwriteType {
  ROLE = 0,
  MEMBER = 1,
}

// https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure
export interface OverwritePayload {
  id: string;
  type: OverwriteType;
  allow: string;
  deny: string;
}

export interface GuildChannelPayload extends ChannelPayload {
  guild_id: string;
  name: string;
  position: number;
  permission_overwrites: OverwritePayload[];
  nsfw: boolean;
  parent_id: string | null;
}

// https://discord.com/developers/docs/resources/channel#channel-object-example-guild-text-channel
export interface GuildTextChannelPayload
  extends GuildChannelPayload, TextChannelPayload {
  rate_limit_per_user: number;
  topic: string | null;
  default_auto_archive_duration: number;
}

// https://discord.com/developers/docs/resources/channel#channel-object-example-guild-news-channel
export type GuildNewsChannelPayload = GuildTextChannelPayload;

// https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes
export enum VideoQualityModes {
  AUTO = 1,
  FULL = 2,
}

// https://discord.com/developers/docs/resources/channel#channel-object-example-guild-voice-channel
export interface GuildVoiceChannelPayload extends GuildChannelPayload {
  bitrate: number;
  user_limit: number;
  rtc_region: string | null;
  video_quality_mode: VideoQualityModes;
}

// https://discord.com/developers/docs/resources/channel#channel-object-example-channel-category
export type CategoryPayload = GuildChannelPayload;

// https://discord.com/developers/docs/resources/channel#channel-object-example-store-channel
export type GuildStoreChannel = GuildChannelPayload;
