import { ChannelType } from "../channels/base.ts";
import {
  ForumDefaultReactionPayload,
  ForumLayout,
  ForumSortOrder,
  GuildChannelPayload,
  GuildForumTagPayload,
  OverwritePayload,
  VideoQualityModes,
} from "../channels/guild.ts";
import { GuildThreadChannelPayload } from "../channels/thread.ts";
import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { Locales } from "../etc/locales.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { GatewayPresenceUpdatePayload } from "../gateways/gateway.ts";
import { ScheduledEventPayload } from "../scheduledEvent/scheduledEvent.ts";
import { StageInstancePayload } from "../stageInstances/stage.ts";
import { StickerPayload } from "../stickers/sticker.ts";
import { VoiceRegionPayload, VoiceStatePayload } from "../voices/voice.ts";
import { WelcomeScreenPayload } from "./etc.ts";
import { GuildMemberPayload } from "./member.ts";
import { RolePayload } from "./role.ts";

export interface GuildPayload {
  afk_channel_id: null | snowflake;
  afk_timeout: number;
  application_id: null | snowflake;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  banner: null | string;
  channels?: GuildChannelPayload[];
  default_message_notifications: DefaultMessageNotificationLevel;
  description: null | string;
  discovery_splash: null | string;
  emojis: EmojiPayload[];
  explicit_content_filter: ExplicitContentFilterLevel;
  features: GuildFeature[];
  guild_scheduled_events?: ScheduledEventPayload[];
  icon: null | string;
  icon_hash?: null | string;
  id: snowflake;
  joined_at?: string;
  large?: boolean;
  max_members?: number;
  max_presences?: null | number;
  max_stage_video_channel_users?: number;
  max_video_channel_users?: number;
  member_count?: number;
  members?: GuildMemberPayload[];
  mfa_level: MFALevel;
  name: string;
  nsfw_level: GuildNSFWLevel;
  owner?: boolean;
  owner_id: snowflake;
  permissions?: string;
  preferred_locale: Locales;
  premium_progress_bar_enabled: boolean;
  premium_subscription_count?: number;
  premium_tier: PremiumTier;
  presences?: GatewayPresenceUpdatePayload[];
  public_updates_channel_id: null | snowflake;
  region?: null | string;
  roles: RolePayload[];
  rules_channel_id: null | snowflake;
  safety_alerts_channel_id: null | snowflake;
  splash: null | string;
  stage_instances?: StageInstancePayload[];
  stickers?: StickerPayload[];
  system_channel_flags: number;
  system_channel_id: null | snowflake;
  threads?: GuildThreadChannelPayload[];
  unavailable?: boolean;
  vanity_url_code: null | string;
  verification_level: VerificationLevel;
  voice_states?: VoiceStatePayload[];
  welcome_screen?: WelcomeScreenPayload;
  widget_channel_id?: null | snowflake;
  widget_enabled: boolean;
}

export enum DefaultMessageNotificationLevel {
  ALL_MESSAGES = 0,
  ONLY_MENTIONS = 1,
}

export enum ExplicitContentFilterLevel {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2,
}

export enum MFALevel {
  NONE = 0,
  ELEVATED = 1,
}

export enum VerificationLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4,
}

export enum GuildNSFWLevel {
  DEFAULT = 0,
  EXPLICIT = 1,
  SAFE = 2,
  AGE_RESTRICTED = 3,
}

export enum PremiumTier {
  NONE = 0,
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
}

export enum SystemChannelFlags {
  SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
  SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
  SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
  SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 1 << 4,
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1 << 5,
}

export enum GuildFeature {
  ANIMATED_BANNER = "ANIMATED_BANNER",
  ANIMATED_ICON = "ANIMATED_ICON",
  APPLICATION_COMMAND_PERMISSIONS_V2 = "APPLICATION_COMMAND_PERMISSIONS_V2",
  AUTO_MODERATION = "AUTO_MODERATION",
  BANNER = "BANNER",
  COMMUNITY = "COMMUNITY",
  CREATOR_MONETIZABLE_PROVISIONAL = "CREATOR_MONETIZABLE_PROVISIONAL",
  CREATOR_STORE_PAGE = "CREATOR_STORE_PAGE",
  DEVELOPER_SUPPORT_SERVER = "DEVELOPER_SUPPORT_SERVER",
  DISCOVERABLE = "DISCOVERABLE",
  FEATURABLE = "FEATURABLE",
  INVITE_SPLASH = "INVITE_SPLASH",
  INVITES_DISABLED = "INVITES_DISABLED",
  MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
  MORE_STICKERS = "MORE_STICKERS",
  NEWS = "NEWS",
  PARTNERED = "PARTNERED",
  PREVIEW_ENABLED = "PREVIEW_ENABLED",
  RAID_ALERTS_DISABLED = "RAID_ALERTS_DISABLED",
  ROLE_ICONS = "ROLE_ICONS",
  ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE =
    "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE",
  ROLE_SUBSCRIPTIONS_ENABLED = "ROLE_SUBSCRIPTIONS_ENABLED",
  TICKETED_EVENTS_ENABLED = "TICKETED_EVENTS_ENABLED",
  VANITY_URL = "VANITY_URL",
  VERIFIED = "VERIFIED",
  VIP_REGIONS = "VIP_REGIONS",
  WELCOME_SCREEN_ENABLED = "WELCOME_SCREEN_ENABLED",
}

export interface PartialGuildChannelPayload {
  id?: number;
  name: string;
  parent_id?: number;
  type: ChannelType;
}

export interface CreateGuildPayload {
  afk_channel_id?: snowflake;
  afk_timeout?: number;
  channels?: PartialGuildChannelPayload[];
  default_message_notifications?: DefaultMessageNotificationLevel;
  explicit_content_filter?: ExplicitContentFilterLevel;
  icon?: null | string;
  name: string;
  roles?: RolePayload[];
  system_channel_flags?: SystemChannelFlags;
  system_channel_id?: snowflake;
  verification_level?: VerificationLevel;
}

export interface GetGuildParams {
  with_counts?: boolean;
}

export interface EditGuildPayload extends Reasonable {
  afk_channel_id?: null | snowflake;
  afk_timeout?: number;
  banner?: null | string;
  default_message_notifications?: DefaultMessageNotificationLevel | null;
  description?: null | string;
  discovery_splash?: null | string;
  explicit_content_filter?: ExplicitContentFilterLevel | null;
  features?: GuildFeature[];
  icon?: null | string;
  name?: string;
  owner_id?: snowflake;
  preferred_locale?: null | string;
  premium_progress_bar_enabled?: boolean;
  public_updates_channel_id?: null | snowflake;
  rules_channel_id?: null | snowflake;
  safety_alerts_channel_id?: null | snowflake;
  splash?: null | string;
  system_channel_flags?: SystemChannelFlags;
  system_channel_id?: null | snowflake;
  verification_level?: null | VerificationLevel;
}

export interface CreateGuildChannelPayload extends Reasonable {
  available_tags?: GuildForumTagPayload[];
  bitrate?: number;
  default_auto_archive_duration?: number;
  default_forum_layout?: ForumLayout;
  default_reaction_emoji?: ForumDefaultReactionPayload;
  default_sort_order?: ForumSortOrder;
  default_thread_rate_limit_per_user?: number;
  name: string;
  nsfw?: boolean;
  parent_id?: snowflake;
  permission_overwrites?: OverwritePayload[];
  position?: number;
  rate_limit_per_user?: number;
  rtc_region?: VoiceRegionPayload;
  topic?: string;
  type?: ChannelType;
  user_limit?: number;
  video_quality_mode?: VideoQualityModes;
}

export interface EditGuildChannelPositionPayload {
  id: snowflake;
  lock_permissions?: boolean | null;
  parent_id?: null | snowflake;
  position?: null | number;
}
