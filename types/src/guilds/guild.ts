import { ChannelType } from "../channels/base.ts";
import {
  ForumDefaultReactionPayload,
  ForumSortOrder,
  GuildChannelPayload,
  GuildForumTagPayload,
  OverwritePayload,
  VideoQualityModes,
} from "../channels/guild.ts";
import { GuildThreadChannelPayload } from "../channels/thread.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { Locales } from "../etc/locales.ts";
import { GatewayPresenceUpdatePayload } from "../gateways/gateway.ts";
import { ScheduledEventPayload } from "../scheduledEvent/scheduledEvent.ts";
import { StageInstancePayload } from "../stageInstances/stage.ts";
import { StickerPayload } from "../stickers/sticker.ts";
import { VoiceRegionPayload, VoiceStatePayload } from "../voices/voice.ts";
import { WelcomeScreenPayload } from "./etc.ts";
import { GuildMemberPayload } from "./member.ts";
import { RolePayload } from "./role.ts";

export interface GuildPayload {
  id: string;
  name: string;
  icon: string | null;
  icon_hash?: string | null;
  splash: string | null;
  discovery_splash: string | null;
  owner?: boolean;
  owner_id: string;
  permissions?: string;
  region?: string | null;
  afk_channel_id: string | null;
  afk_timeout: number;
  widget_enabled: boolean;
  widget_channel_id?: string | null;
  verification_level: VerificationLevel;
  default_message_notifications: DefaultMessageNotificationLevel;
  explicit_content_filter: ExplicitContentFilterLevel;
  roles: RolePayload[];
  emojis: EmojiPayload[];
  features: GuildFeature[];
  mfa_level: MFALevel;
  application_id: string | null;
  system_channel_id: string | null;
  system_channel_flags: number;
  rules_channel_id: string | null;
  joined_at?: string;
  large?: boolean;
  unavailable?: boolean;
  member_count?: number;
  voice_states?: VoiceStatePayload[];
  members?: GuildMemberPayload[];
  channels?: GuildChannelPayload[];
  threads?: GuildThreadChannelPayload[];
  presences?: GatewayPresenceUpdatePayload[];
  max_presences?: number | null;
  max_members?: number;
  vanity_url_code: string | null;
  description: string | null;
  banner: string | null;
  premium_tier: PremiumTier;
  premium_subscription_count?: number;
  preferred_locale: Locales;
  public_updates_channel_id: string | null;
  max_video_channel_users?: number;
  max_stage_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  welcome_screen?: WelcomeScreenPayload;
  nsfw_level: GuildNSFWLevel;
  stage_instances?: StageInstancePayload[];
  stickers?: StickerPayload[];
  guild_scheduled_events?: ScheduledEventPayload[];
  premium_progress_bar_enabled: boolean;
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
  SUPPRESS_JOIN_NOTIFICATIONS = 1,
  SUPPRESS_PREMIUM_SUBSCRIPTIONS = 2,
  SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 4,
  SUPPRESS_JOIN_NOTIFICATION_REPLIES = 8,
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 16,
  SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 32,
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
  INVITES_DISABLED = "INVITES_DISABLED",
  INVITE_SPLASH = "INVITE_SPLASH",
  MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
  MORE_STICKERS = "MORE_STICKERS",
  NEWS = "NEWS",
  PARTNERED = "PARTNERED",
  PREVIEW_ENABLED = "PREVIEW_ENABLED",
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
  name: string;
  type: ChannelType;
  id?: number;
  parent_id?: number;
}

export interface CreateGuildPayload {
  name: string;
  icon?: string | null;
  verification_level?: VerificationLevel;
  default_message_notifications?: DefaultMessageNotificationLevel;
  explicit_content_filter?: ExplicitContentFilterLevel;
  roles?: RolePayload[];
  channels?: PartialGuildChannelPayload[];
  afk_channel_id?: string;
  afk_timeout?: number;
  system_channel_id?: string;
  system_channel_flags?: SystemChannelFlags;
}

export interface GetGuildParams {
  with_counts?: boolean;
}

export interface EditGuildPayload {
  name?: string;
  verification_level?: VerificationLevel | null;
  default_message_notifications?: DefaultMessageNotificationLevel | null;
  explicit_content_filter?: ExplicitContentFilterLevel | null;
  afk_channel_id?: string | null;
  afk_timeout?: number;
  icon?: string | null;
  owner_id?: string;
  splash?: string | null;
  discovery_splash?: string | null;
  banner?: string | null;
  system_channel_id?: string | null;
  system_channel_flags?: SystemChannelFlags;
  rules_channel_id?: string | null;
  public_updates_channel_id?: string | null;
  preferred_locale?: string | null;
  features?: GuildFeature[];
  description?: string | null;
  premium_progress_bar_enabled?: boolean;
}

export interface CreateGuildChannelPayload {
  name: string;
  type?: ChannelType;
  topic?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  position?: number;
  permission_overwrites?: OverwritePayload[];
  parent_id?: string;
  nsfw?: boolean;
  rtc_region?: VoiceRegionPayload;
  video_quality_mode?: VideoQualityModes;
  default_auto_archive_duration?: number;
  default_reaction_emoji?: ForumDefaultReactionPayload;
  available_tags?: GuildForumTagPayload[];
  default_sort_order?: ForumSortOrder;
}

export interface EditGuildChannelPositionPayload {
  id: string;
  position: number | null;
  lock_permissions: boolean | null;
  parent_id: string | null;
}
