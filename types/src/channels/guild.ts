// Thread channels are seperated to a different file.
import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { ChannelPayload, ChannelType, TextChannelPayload } from "./base.ts";

/** @link https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure */
export enum OverwriteType {
  ROLE = 0,
  MEMBER = 1,
}

/** @link https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure */
export interface OverwritePayload {
  allow: string;
  deny: string;
  id: snowflake;
  type: OverwriteType;
}

export interface GuildForumTagPayload {
  emoji_id: null | snowflake;
  emoji_name: null | string;
  id: snowflake;
  moderated: boolean;
  name: string;
}

export interface GuildVoiceBasedChannelPayload extends GuildChannelPayload {
  bitrate: number;
  rtc_region: null | string;
  user_limit: number;
}

export interface GuildTextBasedChannelPayload
  extends GuildChannelPayload, TextChannelPayload {
  rate_limit_per_user: number;
}

export interface GuildThreadAvailableChannelPayload
  extends GuildChannelPayload {
  default_auto_archive_duration: number;
  default_thread_rate_limit_per_user: number;
}

export interface GuildChannelPayload extends ChannelPayload {
  guild_id: snowflake;
  name: string;
  nsfw: boolean;
  parent_id: null | snowflake;
  permission_overwrites: OverwritePayload[];
  position: number;
  topic: null | string;
}

export interface GuildForumChannelPayload
  extends GuildThreadAvailableChannelPayload, GuildTextBasedChannelPayload {
  available_tags: GuildForumTagPayload[];
  default_forum_layout?: ForumLayout;
  default_reaction_emoji?: ForumDefaultReactionPayload | null;
  default_sort_order?: ForumSortOrder;
  flags?: number;
  type: ChannelType.GUILD_FORUM;
}

export enum ForumSortOrder {
  LATEST_ACTIVITY = 0,
  CREATION_DATE = 1,
}

export enum ForumLayout {
  NOT_SET = 0,
  LIST_VIEW = 1,
  GALLERY_VIEW = 2,
}

export interface ForumDefaultReactionPayload {
  emoji_id: null | snowflake;
  emoji_name: null | string;
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-guild-text-channel */
export interface GuildTextChannelPayload
  extends GuildTextBasedChannelPayload, GuildThreadAvailableChannelPayload {
  type: ChannelType.GUILD_TEXT;
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-guild-news-channel */
export interface GuildAnnouncementChannelPayload
  extends GuildTextBasedChannelPayload, GuildThreadAvailableChannelPayload {
  type: ChannelType.GUILD_ANNOUNCEMENT;
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes */
export enum VideoQualityModes {
  AUTO = 1,
  FULL = 2,
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-guild-voice-channel */
export interface GuildVoiceChannelPayload
  extends GuildVoiceBasedChannelPayload, GuildTextBasedChannelPayload {
  type: ChannelType.GUILD_VOICE;
  video_quality_mode: VideoQualityModes;
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-channel-category */
export interface GuildCategoryPayload extends GuildChannelPayload {
  type: ChannelType.GUILD_CATEGORY;
}

export interface GuildStageChannelPayload
  extends GuildVoiceBasedChannelPayload {
  type: ChannelType.GUILD_STAGE_VOICE;
}

/** @link https://discord.com/developers/docs/resources/channel#modify-channel-json-params-guild-channel */
export interface EditGuildChannelPayload extends Reasonable {
  name?: string;
  permission_overwrites?: null | OverwritePayload[];
  position?: null | number;
}

export type EditGuildCategoryPayload = EditGuildChannelPayload;

export interface EditGuildAnnouncementChannelPayload
  extends EditGuildChannelPayload {
  default_auto_archive_duration?: null | number;
  nsfw?: boolean | null;
  parent_id?: null | snowflake;
  topic?: null | string;
  type?: ChannelType.GUILD_ANNOUNCEMENT | ChannelType.GUILD_TEXT;
}

export interface EditGuildTextChannelPayload extends EditGuildChannelPayload {
  default_auto_archive_duration?: null | number;
  default_thread_rate_limit_per_user?: number;
  nsfw?: boolean | null;
  parent_id?: null | snowflake;
  rate_limit_per_user?: null | number;
  topic?: null | string;
  type?: ChannelType.GUILD_ANNOUNCEMENT | ChannelType.GUILD_TEXT;
}

export interface EditGuildVoiceChannelPayload extends EditGuildChannelPayload {
  bitrate?: null | number;
  nsfw?: boolean | null;
  parent_id?: null | snowflake;
  rtc_region?: null | string;
  user_limit?: null | number;
  video_quality_mode?: null | VideoQualityModes;
}

export type EditGuildStageChannelPayload = EditGuildVoiceChannelPayload;

export interface EditGuildForumChannelPayload extends EditGuildChannelPayload {
  available_tags?: GuildForumTagPayload[];
  default_auto_archive_duration?: null | number;
  default_forum_layout?: ForumLayout;
  default_reaction_emoji?: ForumDefaultReactionPayload | null;
  default_sort_order?: ForumSortOrder | null;
  default_thread_rate_limit_per_user?: number;
  flags?: number;
  nsfw?: boolean | null;
  parent_id?: null | snowflake;
  rate_limit_per_user?: null | number;
  topic?: null | string;
}

export interface EditChannelPermissionsPayload extends Reasonable {
  allow?: string;
  deny?: string;
  type: OverwriteType;
}

export interface FollowAnnouncementChannelPayload {
  webhook_channel_id: snowflake;
}
