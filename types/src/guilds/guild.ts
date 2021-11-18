import { GuildChannelPayload } from "../channels/guild.ts";

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
  verification_level: number;
  default_message_notifications: DefaultMessageNotificationLevel;
  explicit_content_filter: ExplicitContentFilterLevel;
  // roles: RolePayload[];
  // emojis: EmojiPayload[];
  features: GuildFeature[];
  mfa_level: MFALevel;
  application_id: string | null;
  system_channel_id: string | null;
  system_channel_flags: number;
  joined_at?: string;
  large?: boolean;
  unavailable?: boolean;
  member_count?: number;
  // voice_states?: VoiceStatePayload[];
  // members?: MemberPayload[];
  channels?: GuildChannelPayload[];
  // presences?: PresencePayload[];
  max_presences?: number | null;
  max_members?: number;
  vanity_url_code: string | null;
  description: string | null;
  banner: string | null;
  premium_tier: PremiumTier;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id: string | null;
  max_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  // welcome_screen?: WelcomeScreenPayload;
  nsfw_level: GuildNSFWLevel;
  // stage_instances?: StageInstancePayload[];
  // stickers?: StickerPayload[];
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
}

export enum GuildFeature {
  ANIMATED_ICON = "ANIMATED_ICON",
  BANNER = "BANNER",
  COMMERCE = "COMMERCE",
  COMMUNITY = "COMMUNITY",
  DISCOVERABLE = "DISCOVERABLE",
  FEATURABLE = "FEATURABLE",
  INVITE_SPLASH = "INVITE_SPLASH",
  MEMBER_VERIFICATION_GATE_ENABLED = "MEMBER_VERIFICATION_GATE_ENABLED",
  MONETIZATION_ENABLED = "MONETIZATION_ENABLED",
  MORE_STICKERS = "MORE_STICKERS",
  NEWS = "NEWS",
  PARTNERED = "PARTNERED",
  PREVIEW_ENABLED = "PREVIEW_ENABLED",
  PRIVATE_THREADS = "PRIVATE_THREADS",
  ROLE_ICONS = "ROLE_ICONS",
  SEVEN_DAY_THREAD_ARCHIVE = "SEVEN_DAY_THREAD_ARCHIVE",
  THREE_DAY_THREAD_ARCHIVE = "THREE_DAY_THREAD_ARCHIVE",
  TICKETED_EVENTS_ENABLED = "TICKETED_EVENTS_ENABLED",
  VANITY_URL = "VANITY_URL",
  VERIFIED = "VERIFIED",
  VIP_REGIONS = "VIP_REGIONS",
  WELCOME_SCREEN_ENABLED = "WELCOME_SCREEN_ENABLED",
}
