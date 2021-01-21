import { Emoji } from '../structures/emoji.ts'
import { CategoryChannel } from '../structures/guildCategoryChannel.ts'
import { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import { Role } from '../structures/role.ts'
import { GuildTextChannel } from '../structures/textChannel.ts'
import { ApplicationPayload } from './application.ts'
import {
  ChannelPayload,
  ChannelTypes,
  GuildCategoryChannelPayload,
  GuildTextChannelPayload,
  GuildVoiceChannelPayload
} from './channel.ts'
import { EmojiPayload } from './emoji.ts'
import { PresenceUpdatePayload } from './gateway.ts'
import { RolePayload } from './role.ts'
import { UserPayload } from './user.ts'
import { VoiceStatePayload } from './voice.ts'

export interface GuildPayload {
  id: string
  name: string
  icon?: string
  icon_hash?: string
  splash?: string
  discovery_splash?: string
  owner?: boolean
  owner_id: string
  permissions?: string
  region: string
  afk_channel_id?: string
  afk_timeout: number
  widget_enabled?: boolean
  widget_channel_id?: string
  verification_level: Verification
  default_message_notifications: MessageNotification
  explicit_content_filter: ContentFilter
  roles: RolePayload[]
  emojis: EmojiPayload[]
  features: GuildFeatures[]
  mfa_level: string
  application_id?: string
  system_channel_id?: string
  system_channel_flags: string
  rules_channel_id?: string
  joined_at?: string
  large?: boolean
  unavailable: boolean
  member_count?: number
  voice_states?: VoiceStatePayload[]
  members?: MemberPayload[]
  channels?: ChannelPayload[]
  presences?: PresenceUpdatePayload[]
  max_presences?: number
  max_members?: number
  vanity_url_code?: string
  description?: string
  banner?: string
  premium_tier: number
  premium_subscription_count?: number
  preferred_locale: string
  public_updates_channel_id?: string
  max_video_channel_users?: number
  approximate_number_count?: number
  approximate_presence_count?: number
}

export interface MemberPayload {
  user: UserPayload
  nick?: string
  roles: string[]
  joined_at: string
  premium_since?: string
  deaf: boolean
  mute: boolean
  pending?: boolean
}

export enum MessageNotification {
  ALL_MESSAGES = 0,
  ONLY_MENTIONS = 1
}

export enum ContentFilter {
  DISABLED = 0,
  MEMBERS_WITHOUT_ROLES = 1,
  ALL_MEMBERS = 2
}

export enum MFA {
  NONE = 0,
  ELEVATED = 1
}

export enum Verification {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  VERY_HIGH = 4
}

export enum PremiumTier {
  NONE = 0,
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3
}

export enum SystemChannelFlags {
  SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
  SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1
}

export type GuildFeatures =
  | 'INVITE_SPLASH'
  | 'VIP_REGIONS'
  | 'VANITY_URL'
  | 'VERIFIED'
  | 'PARTNERED'
  | 'PUBLIC'
  | 'COMMERCE'
  | 'NEWS'
  | 'DISCOVERABLE'
  | 'FEATURABLE'
  | 'ANIMATED_ICON'
  | 'BANNER'
  | 'WELCOME_SCREEN_ENABLED'
  | 'MEMBER_VERIFICATION_GATE_ENABLED'
  | 'PREVIEW_ENABLED'

export enum IntegrationExpireBehavior {
  REMOVE_ROLE = 0,
  KICK = 1
}

export interface IntegrationAccountPayload {
  id: string
  name: string
}

export interface GuildIntegrationPayload {
  id: string
  name: string
  type: string
  enabled: boolean
  syncing?: boolean
  role_id?: string
  enable_emoticons?: boolean
  expire_behaviour?: IntegrationExpireBehavior
  expire_grace_period?: number
  user?: UserPayload
  account: IntegrationAccountPayload
  synced_at?: string // Actually a ISO Timestamp, but we parse in constructor
  subscriber_count?: number
  revoked?: boolean
  application?: ApplicationPayload
}

export interface GuildBanPayload {
  reason: string | null
  user: UserPayload
}

export type GuildChannelPayloads =
  | GuildTextChannelPayload
  | GuildVoiceChannelPayload
  | GuildCategoryChannelPayload
export type GuildChannels = GuildTextChannel | VoiceChannel | CategoryChannel

export interface GuildCreatePayload {
  name: string
  region?: string
  icon?: string
  verification_level?: number
  default_message_notifications?: number
  explicit_content_filter?: number
  roles?: GuildCreateRolePayload[]
  channels?: GuildCreateChannelPayload[]
  afk_channel_id?: string
  afk_timeout?: number
  system_channel_id?: string
}

export interface GuildCreateRolePayload {
  id?: string
  name: string
  color?: number
  hoist?: boolean
  position?: number
  permissions?: string
  managed?: boolean
  mentionable?: boolean
}

export interface GuildCreateChannelPayload {
  id?: string
  name: string
  type: ChannelTypes
  parent_id?: string
}

export interface GuildCreateChannelOptions {
  id?: string
  name: string
  type: ChannelTypes
  parentID?: string
}

export interface GuildCreateOptions {
  name: string
  region?: string
  icon?: string
  verificationLevel?: Verification
  roles?: Array<Role | GuildCreateRolePayload>
  channels?: Array<GuildChannels | GuildCreateChannelOptions>
  afkChannelID?: string
  afkTimeout?: number
  systemChannelID?: string
}

export interface GuildPreviewPayload {
  id: string
  name: string
  icon: string | null
  splash: string | null
  discovery_splash: string | null
  emojis: EmojiPayload[]
  features: GuildFeatures[]
  approximate_member_count: number
  approximate_presence_count: number
  description: string | null
}

export interface GuildPreview {
  id: string
  name: string
  icon: string | null
  splash: string | null
  discoverySplash: string | null
  emojis: Emoji[]
  features: GuildFeatures[]
  approximateMemberCount: number
  approximatePresenceCount: number
  description: string | null
}

export interface GuildModifyPayload {
  name?: string
  region?: string | null
  verification_level?: Verification | null
  default_message_notifications?: MessageNotification | null
  explicit_content_filter?: ContentFilter | null
  afk_channel_id?: string | null
  afk_timeout?: number
  icon?: string | null
  owner_id?: string
  splash?: string | null
  banner?: string | null
  system_channel_id?: string | null
  rules_channel_id?: string | null
  public_updates_channel_id?: string | null
  preferred_locale?: string | null
}

export interface GuildModifyOptions {
  name?: string
  region?: string | null
  verificationLevel?: Verification | null
  defaultMessageNotifications?: MessageNotification | null
  explicitContentFilter?: ContentFilter | null
  afkChannelID?: string | null
  afkTimeout?: number
  icon?: string | null
  ownerID?: string
  splash?: string | null
  banner?: string | null
  systemChannelID?: string | null
  rulesChannelID?: string | null
  publicUpdatesChannelID?: string | null
  preferredLocale?: string | null
}

export interface GuildPruneCountPayload {
  pruned: number | null
}

export interface GuildGetPruneCountPayload {
  days?: number
  include_roles?: string
}

export interface GuildBeginPrunePayload {
  days?: number
  compute_prune_count?: boolean
  include_roles?: string[]
}
