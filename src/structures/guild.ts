import { Client } from '../models/client.ts'
import { GuildFeatures, GuildPayload } from '../types/guildTypes.ts'
import { PresenceUpdatePayload } from '../types/presenceTypes.ts'
import { Base } from './base.ts'
import { Channel } from './channel.ts'
import { Emoji } from './emoji.ts'
import { Member } from './member.ts'
import { Role } from './role.ts'
import { VoiceState } from './voiceState.ts'

export class Guild extends Base {
  id: string
  name: string
  icon?: string
  iconHash?: string
  splash?: string
  discoverySplash?: string
  owner?: boolean
  ownerID: string
  permissions?: string
  region: string
  afkChannelID?: string
  afkTimeout: number
  widgetEnabled?: boolean
  widgetChannelID?: string
  verificationLevel: string
  defaultMessageNotifications: string
  explicitContentFilter: string
  roles: Role[]
  emojis: Emoji[]
  features: GuildFeatures[]
  mfaLevel: string
  applicationID?: string
  systemChannelID?: string
  systemChannelFlags: string
  rulesChannelID?: string
  joinedAt?: string
  large?: boolean
  unavailable: boolean
  memberCount?: number
  voiceStates?: VoiceState[]
  members?: Member[]
  channels?: Channel[]
  presences?: PresenceUpdatePayload[]
  maxPresences?: number
  maxMembers?: number
  vanityURLCode?: string
  description?: string
  banner?: string
  premiumTier: number
  premiumSubscriptionCount?: number
  preferredLocale: string
  publicUpdatesChannelID?: string
  maxVideoChannelUsers?: number
  approximateNumberCount?: number
  approximatePresenceCount?: number

  constructor (client: Client, data: GuildPayload) {
    super(client, data)
    this.id = data.id
    this.name = data.name
    this.icon = data.icon
    this.iconHash = data.icon_hash
    this.splash = data.splash
    this.discoverySplash = data.discovery_splash
    this.owner = data.owner
    this.ownerID = data.owner_id
    this.permissions = data.permissions
    this.region = data.region
    this.afkTimeout = data.afk_timeout
    this.afkChannelID = data.afk_channel_id
    this.widgetEnabled = data.widget_enabled
    this.widgetChannelID = data.widget_channel_id
    this.verificationLevel = data.verification_level
    this.defaultMessageNotifications = data.default_message_notifications
    this.explicitContentFilter = data.explicit_content_filter
    this.roles = data.roles.map(v => new Role(client, v))
    this.emojis = data.emojis.map(v => new Emoji(client, v))
    this.features = data.features
    this.mfaLevel = data.mfa_level
    this.systemChannelID = data.system_channel_id
    this.systemChannelFlags = data.system_channel_flags
    this.rulesChannelID = data.rules_channel_id
    this.joinedAt = data.joined_at
    this.large = data.large
    this.unavailable = data.unavailable
    this.memberCount = data.member_count
    this.voiceStates = data.voice_states?.map(v => new VoiceState(client, v))
    this.members = data.members?.map(v => new Member(client, v))
    this.channels = data.channels?.map(v => new Channel(client, v))
    this.presences = data.presences
    this.maxPresences = data.max_presences
    this.maxMembers = data.max_members
    this.vanityURLCode = data.vanity_url_code
    this.description = data.description
    this.banner = data.banner
    this.premiumTier = data.premium_tier
    this.premiumSubscriptionCount = data.premium_subscription_count
    this.preferredLocale = data.preferred_locale
    this.publicUpdatesChannelID = data.public_updates_channel_id
    this.maxVideoChannelUsers = data.max_video_channel_users
    this.approximateNumberCount = data.approximate_number_count
    this.approximatePresenceCount = data.approximate_presence_count
  }
}
