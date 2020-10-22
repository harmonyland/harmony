import { Client } from '../models/client.ts'
import { EmojiPayload } from '../types/emojiTypes.ts'
import { GuildFeatures, GuildPayload } from '../types/guildTypes.ts'
import { PresenceUpdatePayload } from '../types/presenceTypes.ts'
import { VoiceStatePayload } from '../types/voiceTypes.ts'
import { Base } from './base.ts'
import { Channel } from './channel.ts'
import { Emoji } from './emoji.ts'
import { Member } from './member.ts'
import { Role } from './role.ts'

export class Guild extends Base implements GuildPayload {
  id: string
  name: string
  icon: string | undefined
  icon_hash?: string | undefined
  splash: string | undefined
  discovery_splash: string | undefined
  owner?: boolean | undefined
  owner_id: string
  permissions?: string | undefined
  region: string
  afk_channel_id: string | undefined
  afk_timeout: number
  widget_enabled?: boolean | undefined
  widge_channel_id?: string | undefined
  verification_level: string
  default_message_notifications: string
  explicit_content_filter: string
  roles: Role[]
  emojis: Emoji[]
  features: GuildFeatures[]
  mfa_level: string
  application_id: string | undefined
  system_channel_id: string | undefined
  system_channel_flags: string
  rules_channel_id: string | undefined
  joined_at?: string | undefined
  large?: boolean | undefined
  unavailable: boolean
  member_count?: number | undefined
  voice_states?: VoiceStatePayload[] | undefined
  members?: Member[] | undefined
  channels?: Channel[] | undefined
  presences?: PresenceUpdatePayload[] | undefined
  max_presences?: number | undefined
  max_members?: number | undefined
  vanity_url_code: string | undefined
  description: string | undefined
  banner: string | undefined
  premium_tier: number
  premium_subscription_count?: number | undefined
  preferred_locale: string
  public_updates_channel_id: string | undefined
  max_video_channel_users?: number | undefined
  approximate_number_count?: number | undefined
  approximate_presence_count?: number | undefined

  constructor (client: Client, data: GuildPayload) {
    super(client)
    this.id = data.id
    this.name = data.name
    this.icon = data.icon
    this.icon_hash = data.icon_hash
    this.splash = data.splash
    this.discovery_splash = data.discovery_splash
    this.owner = data.owner
    this.owner_id = data.owner_id
    this.permissions = data.permissions
    this.region = data.region
    this.afk_timeout = data.afk_timeout
    this.afk_channel_id = data.afk_channel_id
    this.widget_enabled = data.widget_enabled
    this.widge_channel_id = data.widge_channel_id
    this.verification_level = data.verification_level
    this.default_message_notifications = data.default_message_notifications
    this.explicit_content_filter = data.explicit_content_filter
    this.roles = data.roles
    this.emojis = data.emojis
    this.features = data.features
    this.mfa_level = data.mfa_level
    this.system_channel_id = data.system_channel_id
    this.system_channel_flags = data.system_channel_flags
    this.rules_channel_id = data.rules_channel_id
    this.joined_at = data.joined_at
    this.large = data.large
    this.unavailable = data.unavailable
    this.member_count = data.member_count
    this.voice_states = data.voice_states
    this.members = data.members
    this.channels = data.channels
    this.presences = data.presences
    this.max_presences = data.max_presences
    this.max_members = data.max_members
    this.vanity_url_code = data.vanity_url_code
    this.description = data.description
    this.banner = data.banner
    this.premium_tier = data.premium_tier
    this.premium_subscription_count = data.premium_subscription_count
    this.preferred_locale = data.preferred_locale
    this.public_updates_channel_id = data.public_updates_channel_id
    this.max_video_channel_users = data.max_video_channel_users
    this.approximate_number_count = data.approximate_number_count
    this.approximate_presence_count = data.approximate_presence_count
  }
}
