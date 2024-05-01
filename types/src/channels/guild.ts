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
  id: snowflake;
  type: OverwriteType;
  allow: string;
  deny: string;
}

export interface GuildForumTagPayload {
  id: snowflake;
  name: string;
  moderated: boolean;
  emoji_id: snowflake | null;
  emoji_name: string | null;
}

export interface GuildVoiceBasedChannelPayload extends GuildChannelPayload {
  bitrate: number;
  user_limit: number;
  rtc_region: string | null;
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
  position: number;
  permission_overwrites: OverwritePayload[];
  nsfw: boolean;
  parent_id: snowflake | null;
  topic: string | null;
}

export interface GuildForumChannelPayload
  extends GuildThreadAvailableChannelPayload, GuildTextBasedChannelPayload {
  type: ChannelType.GUILD_FORUM;
  default_reaction_emoji?: ForumDefaultReactionPayload | null;
  default_sort_order?: ForumSortOrder;
  default_forum_layout?: ForumLayout;
  available_tags: GuildForumTagPayload[];
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
  emoji_id: snowflake | null;
  emoji_name: string | null;
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
  position?: number | null;
  permission_overwrites?: OverwritePayload[] | null;
}

export type EditGuildCategoryPayload = EditGuildChannelPayload;

export interface EditGuildAnnouncementChannelPayload
  extends EditGuildChannelPayload {
  type?: ChannelType.GUILD_TEXT | ChannelType.GUILD_ANNOUNCEMENT;
  topic?: string | null;
  parent_id?: snowflake | null;
  default_auto_archive_duration?: number | null;
  nsfw?: boolean | null;
}

export interface EditGuildTextChannelPayload extends EditGuildChannelPayload {
  type?: ChannelType.GUILD_TEXT | ChannelType.GUILD_ANNOUNCEMENT;
  topic?: string | null;
  parent_id?: snowflake | null;
  rate_limit_per_user?: number | null;
  default_thread_rate_limit_per_user?: number;
  default_auto_archive_duration?: number | null;
  nsfw?: boolean | null;
}

export interface EditGuildVoiceChannelPayload extends EditGuildChannelPayload {
  bitrate?: number | null;
  user_limit?: number | null;
  rtc_region?: string | null;
  video_quality_mode?: VideoQualityModes | null;
  parent_id?: snowflake | null;
  nsfw?: boolean | null;
}

export type EditGuildStageChannelPayload = EditGuildVoiceChannelPayload;

export interface EditGuildForumChannelPayload extends EditGuildChannelPayload {
  flags?: number;
  available_tags?: GuildForumTagPayload[];
  default_reaction_emoji?: ForumDefaultReactionPayload | null;
  default_thread_rate_limit_per_user?: number;
  default_sort_order?: ForumSortOrder | null;
  default_forum_layout?: ForumLayout;
  parent_id?: snowflake | null;
  nsfw?: boolean | null;
  topic?: string | null;
  rate_limit_per_user?: number | null;
  default_auto_archive_duration?: number | null;
}

export interface EditChannelPermissionsPayload extends Reasonable {
  allow?: string;
  deny?: string;
  type: OverwriteType;
}

export interface FollowAnnouncementChannelPayload {
  webhook_channel_id: snowflake;
}
