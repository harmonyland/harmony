import { Client } from '../models/client.ts'
import { ChannelPayload } from '../types/channelTypes.ts'
import { EmojiPayload } from '../types/emojiTypes.ts'
import { GUILD } from '../types/endpoint.ts'
import {
  GuildFeatures,
  GuildPayload,
  MemberPayload
} from '../types/guildTypes.ts'
import { PresenceUpdatePayload } from '../types/presenceTypes.ts'
import { RolePayload } from '../types/roleTypes.ts'
import { VoiceStatePayload } from '../types/voiceTypes.ts'
import { Base } from './base.ts'
import * as cache from '../models/cache.ts'

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
  roles: RolePayload[]
  emojis: EmojiPayload[]
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
  voiceStates?: VoiceStatePayload[]
  members?: MemberPayload[]
  channels?: ChannelPayload[]
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
    super(client)
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
    this.widgetChannelID = data.widge_channel_id
    this.verificationLevel = data.verification_level
    this.defaultMessageNotifications = data.default_message_notifications
    this.explicitContentFilter = data.explicit_content_filter
    this.roles = data.roles
    this.emojis = data.emojis
    this.features = data.features
    this.mfaLevel = data.mfa_level
    this.systemChannelID = data.system_channel_id
    this.systemChannelFlags = data.system_channel_flags
    this.rulesChannelID = data.rules_channel_id
    this.joinedAt = data.joined_at
    this.large = data.large
    this.unavailable = data.unavailable
    this.memberCount = data.member_count
    this.voiceStates = data.voice_states
    this.members = data.members
    this.channels = data.channels
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

  static async autoInit (client: Client, guildID: string) {
    const cached = cache.get('guilds', guildID)
    if (cached === undefined || !(cached instanceof Guild)) {
      const resp = await fetch(GUILD(guildID), {
        headers: {
          Authorization: `Bot ${client.token}`
        }
      })
      const guildParsed: GuildPayload = await resp.json()

      const newGuild = new Guild(client, guildParsed)
      cache.set('guilds', guildID, newGuild)
      return newGuild
    } else {
      return cached
    }
  }
}
