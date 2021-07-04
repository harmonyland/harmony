import type { GuildChannel } from '../structures/channel.ts'
import type { Emoji } from '../structures/emoji.ts'
import type { CategoryChannel } from '../structures/guildCategoryChannel.ts'
import type { NewsChannel } from '../structures/guildNewsChannel.ts'
import type { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import type { Role } from '../structures/role.ts'
import type {
  GuildTextChannel,
  GuildTextBasedChannel
} from '../structures/guildTextChannel.ts'
import type { ApplicationPayload } from './application.ts'
import type {
  ChannelPayload,
  ChannelTypes,
  GuildCategoryChannelPayload,
  GuildNewsChannelPayload,
  GuildTextBasedChannelPayload,
  GuildTextChannelPayload,
  GuildVoiceChannelPayload,
  ThreadChannelPayload
} from './channel.ts'
import type { EmojiPayload } from './emoji.ts'
import type { PresenceUpdatePayload } from './gateway.ts'
import type { RolePayload } from './role.ts'
import type { UserPayload } from './user.ts'
import type { VoiceStatePayload } from './voice.ts'
import type { WebhookPayload } from './webhook.ts'
import type { User } from '../structures/user.ts'
import { GuildIntegration } from '../../mod.ts'

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
  unavailable?: boolean
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
  nsfw: boolean
  threads?: ThreadChannelPayload[]
}

export interface MemberPayload {
  user: UserPayload
  nick: string | null
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

export interface GuildWidgetPayload {
  id: string
  name: string
  instant_invite: string
  channels: Array<{ id: string; name: string; position: number }>
  members: MemberPayload[]
  presence_count: number
}

export type GuildTextBasedPayloads =
  | GuildTextBasedChannelPayload
  | GuildTextChannelPayload
  | GuildNewsChannelPayload

export type GuildChannelPayloads =
  | GuildTextBasedPayloads
  | GuildVoiceChannelPayload
  | GuildCategoryChannelPayload

export type GuildTextBasedChannels =
  | GuildTextBasedChannel
  | GuildTextChannel
  | NewsChannel

export type GuildChannels =
  | GuildChannel
  | GuildTextBasedChannels
  | VoiceChannel
  | CategoryChannel

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
  id: string
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

export enum AuditLogEvents {
  GuildUpdate = 1,
  ChannelCreate = 10,
  ChannelUpdate = 11,
  ChannelDelete = 12,
  ChannelOverwriteCreate = 13,
  ChannelOverwriteUpdate = 14,
  ChannelOverwriteDelete = 15,
  MemberKick = 20,
  MemberPrune = 21,
  MemberBanAdd = 22,
  MemberBanRemove = 23,
  MemberUpdate = 24,
  MemberRoleUpdate = 25,
  MemberMove = 26,
  MemberDisconnect = 27,
  BotAdd = 28,
  RoleCreate = 30,
  RoleUpdate = 31,
  RoleDelete = 32,
  InviteCreate = 40,
  InviteUpdate = 41,
  InviteDelete = 42,
  WebhookCreate = 50,
  WebhookUpdate = 51,
  WebhookDelete = 52,
  EmojiCreate = 60,
  EmojiUpdate = 61,
  EmojiDelete = 62,
  MessageDelete = 72,
  MessageBulkDelete = 73,
  MessagePin = 74,
  MessageUnpin = 75,
  IntegrationCreate = 80,
  IntegrationUpdate = 81,
  IntegrationDelete = 82
}

export interface AuditLogPayload {
  /** list of webhooks found in the audit log */
  webhooks: WebhookPayload[]
  /** list of users found in the audit log */
  users: UserPayload[]
  /** list of audit log entries */
  audit_log_entries: AuditLogEntryPayload[]
  /** list of partial integration objects */
  integrations: GuildIntegrationPayload[]
}

export interface AuditLogEntryPayload {
  /** id of the affected entity (webhook, user, role, etc.) */
  target_id: string | null
  /** changes made to the target_id */
  changes?: AuditLogChangePayload[]
  /** the user who made the changes */
  user_id: string
  /** id of the entry */
  id: string
  /** type of action that occurred */
  action_type: AuditLogEvents
  /** additional info for certain action types */
  options?: OptionalAuditEntryInfoPayload
  /** the reason for the change (0-512 characters) */
  reason?: string
}

export interface OptionalAuditEntryInfoPayload {
  /** number of days after which inactive members were kicked */
  delete_member_days: string
  /** number of members removed by the prune */
  members_removed: string
  /** channel in which the entities were targeted */
  channel_id: string
  /** id of the message that was targeted */
  message_id: string
  /** number of entities that were targeted */
  count: string
  /** id of the overwritten entity */
  id: string
  /** type of overwritten entity - "0" for "role" or "1" for "member" */
  type: string
  /** name of the role if type is "0" (not present if type is "1") */
  role_name: string
}

/** > info
> If `new_value` is not present in the change object, while `old_value` is, that means the property that was changed has been reset, or set to `null` */
export interface AuditLogChangePayload {
  /** new value of the key */
  new_value?: any
  /** old value of the key */
  old_value?: any
  /** name of audit log [change key](#DOCS_RESOURCES_AUDIT_LOG/audit-log-change-object-audit-log-change-key) */
  key: string
}

export interface AuditLog {
  /** list of webhooks found in the audit log */
  webhooks: WebhookPayload[]
  /** list of users found in the audit log */
  users: User[]
  /** list of audit log entries */
  entries: AuditLogEntry[]
  /** list of partial integration objects */
  integrations: GuildIntegration[]
}

export interface AuditLogEntry {
  /** id of the affected entity (webhook, user, role, etc.) */
  target_id: string | null
  /** changes made to the target_id */
  changes?: AuditLogChangePayload[]
  /** the user who made the changes */
  userID: string
  /** id of the entry */
  id: string
  /** type of action that occurred */
  action_type: AuditLogEvents
  /** additional info for certain action types */
  options?: OptionalAuditEntryInfo
  /** the reason for the change (0-512 characters) */
  reason?: string
}

export interface OptionalAuditEntryInfo {
  /** number of days after which inactive members were kicked */
  deleteMemberDays: string
  /** number of members removed by the prune */
  membersRemoved: string
  /** channel in which the entities were targeted */
  channelID: string
  /** id of the message that was targeted */
  messageID: string
  /** number of entities that were targeted */
  count: string
  /** id of the overwritten entity */
  id: string
  /** type of overwritten entity - "0" for "role" or "1" for "member" */
  type: string
  /** name of the role if type is "0" (not present if type is "1") */
  roleName: string
}

export interface AuditLogChange {
  /** new value of the key */
  newValue?: any
  /** old value of the key */
  oldValue?: any
  /** name of audit log change key */
  key: string
}
