// Thread channels are seperated to a different file.
import { Reasonable } from "../etc/reasonable.ts";
import { ChannelPayload, ChannelType, TextChannelPayload } from "./base.ts";

/** @link https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure */
export enum OverwriteType {
  ROLE = 0,
  MEMBER = 1,
}

/** @link https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure */
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

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-guild-text-channel */
export interface GuildTextChannelPayload
  extends GuildChannelPayload, TextChannelPayload {
  rate_limit_per_user: number;
  topic: string | null;
  default_auto_archive_duration: number;
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-guild-news-channel */
export type GuildNewsChannelPayload = GuildTextChannelPayload;

/** @link https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes */
export enum VideoQualityModes {
  AUTO = 1,
  FULL = 2,
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-guild-voice-channel */
export interface GuildVoiceChannelPayload extends GuildChannelPayload {
  bitrate: number;
  user_limit: number;
  rtc_region: string | null;
  video_quality_mode: VideoQualityModes;
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-channel-category */
export type CategoryPayload = GuildChannelPayload;

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-store-channel */
export type GuildStoreChannel = GuildChannelPayload;

/** @link https://discord.com/developers/docs/resources/channel#modify-channel-json-params-guild-channel */
export interface EditGuildChannelPayload extends Reasonable {
  name?: string;
  position?: number | null;
  permission_overwrites?: OverwritePayload[] | null;
}

export interface EditGuildStoreChannelPayload extends EditGuildChannelPayload {
  nsfw?: boolean | null;
  parent_id?: string | null;
}

export interface EditGuildNewsChannelPayload
  extends EditGuildStoreChannelPayload {
  type?: ChannelType;
  topic?: string | null;
  /** Duration in minute */
  default_auto_archive_duration?: number | null;
}

export interface EditGuildTextChannelPayload
  extends EditGuildNewsChannelPayload {
  /** Duration in second */
  rate_limit_per_user?: number | null;
}

export interface EditGuildVoiceChannelPayload extends EditGuildChannelPayload {
  bitrate?: number | null;
  user_limit?: number | null;
  parent_id?: string | null;
  rtc_region?: string | null;
  video_quality_mode?: VideoQualityModes | null;
}

export type EditGuildCategoryPayload = EditGuildChannelPayload;

export interface EditChannelPermissionsPayload extends Reasonable {
  allow: string;
  deny: string;
  type: OverwriteType;
}
