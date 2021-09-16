// deno-lint-ignore-file camelcase
// Thread channels are seperated to a different file.
import { ChannelPayload, TextChannelPayload } from "./base.ts";

export enum OverwriteType {
  ROLE = 0,
  MEMBER = 1,
}

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

export interface GuildTextChannelPayload
  extends GuildChannelPayload, TextChannelPayload {
  rate_limit_per_user: number;
  topic: string | null;
  default_auto_archive_duration: number;
}

export type GuildNewsChannelPayload = GuildTextChannelPayload;

export enum VideoQualityModes {
  AUTO = 1,
  FULL = 2,
}

export interface GuildVoiceChannelPayload extends GuildChannelPayload {
  bitrate: number;
  user_limit: number;
  rtc_region: string | null;
  video_quality_mode: VideoQualityModes;
}

export type CategoryPayload = GuildChannelPayload;

export type GuildStoreChannel = GuildChannelPayload;
