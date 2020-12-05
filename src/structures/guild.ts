import { Client } from '../models/client.ts'
import {
  GuildBanPayload,
  GuildFeatures,
  GuildIntegrationPayload,
  GuildPayload,
  IntegrationAccountPayload,
  IntegrationExpireBehavior
} from '../types/guild.ts'
import { Base } from './base.ts'
import { RolesManager } from '../managers/roles.ts'
import { InviteManager } from '../managers/invites.ts'
import { GuildChannelsManager } from '../managers/guildChannels.ts'
import { MembersManager } from '../managers/members.ts'
import { Role } from './role.ts'
import { GuildEmojisManager } from '../managers/guildEmojis.ts'
import { Member } from './member.ts'
import { User } from './user.ts'
import { Application } from './application.ts'
import { GUILD_BAN, GUILD_BANS, GUILD_INTEGRATIONS } from '../types/endpoint.ts'
import { GuildVoiceStatesManager } from '../managers/guildVoiceStates.ts'
import { RequestMembersOptions } from '../gateway/index.ts'
import { GuildPresencesManager } from '../managers/presences.ts'

export class GuildBan extends Base {
  guild: Guild
  reason?: string
  user: User

  constructor(client: Client, data: GuildBanPayload, guild: Guild) {
    super(client, data)
    this.guild = guild
    this.reason = data.reason === null ? undefined : data.reason
    this.user = new User(client, data.user)
  }
}

export class GuildBans {
  client: Client
  guild: Guild

  constructor(client: Client, guild: Guild) {
    this.client = client
    this.guild = guild
  }

  /**
   * Gets all bans in the Guild.
   */
  async all(): Promise<GuildBan[]> {
    const res = await this.client.rest.get(GUILD_BANS(this.guild.id))
    if (typeof res !== 'object' || !Array.isArray(res))
      throw new Error('Failed to fetch Guild Bans')

    const bans = (res as GuildBanPayload[]).map(
      (ban) => new GuildBan(this.client, ban, this.guild)
    )
    return bans
  }

  /**
   * Gets ban details of a User if any.
   * @param user User to get ban of, ID or User object.
   */
  async get(user: string | User): Promise<GuildBan> {
    const res = await this.client.rest.get(
      GUILD_BAN(this.guild.id, typeof user === 'string' ? user : user.id)
    )
    if (typeof res !== 'object') throw new Error('Failed to fetch Guild Ban')
    return new GuildBan(this.client, res, this.guild)
  }

  /**
   * Bans a User.
   * @param user User to ban, ID or User object.
   * @param reason Reason for the Ban.
   * @param deleteMessagesDays Delete Old Messages? If yes, how much days.
   */
  async add(
    user: string | User,
    reason?: string,
    deleteMessagesDays?: number
  ): Promise<void> {
    const res = await this.client.rest.put(
      GUILD_BAN(this.guild.id, typeof user === 'string' ? user : user.id),
      {
        reason,
        delete_message_days: deleteMessagesDays
      },
      undefined,
      null,
      true
    )
    if (res.response.status !== 204) throw new Error('Failed to Add Guild Ban')
  }

  /**
   * Unbans (removes ban from) a User.
   * @param user User to unban, ID or User object.
   */
  async remove(user: string | User): Promise<boolean> {
    const res = await this.client.rest.delete(
      GUILD_BAN(this.guild.id, typeof user === 'string' ? user : user.id),
      undefined,
      undefined,
      null,
      true
    )

    if (res.response.status !== 204) return false
    else return true
  }
}

export class Guild extends Base {
  id: string
  name?: string
  icon?: string
  iconHash?: string
  splash?: string
  discoverySplash?: string
  owner?: boolean
  ownerID?: string
  permissions?: string
  region?: string
  afkChannelID?: string
  afkTimeout?: number
  widgetEnabled?: boolean
  widgetChannelID?: string
  verificationLevel?: string
  defaultMessageNotifications?: string
  explicitContentFilter?: string
  roles: RolesManager
  emojis: GuildEmojisManager
  invites: InviteManager
  features?: GuildFeatures[]
  mfaLevel?: string
  applicationID?: string
  systemChannelID?: string
  systemChannelFlags?: string
  rulesChannelID?: string
  joinedAt?: string
  large?: boolean
  unavailable: boolean
  memberCount?: number
  voiceStates: GuildVoiceStatesManager
  members: MembersManager
  channels: GuildChannelsManager
  presences: GuildPresencesManager
  maxPresences?: number
  maxMembers?: number
  vanityURLCode?: string
  description?: string
  banner?: string
  premiumTier?: number
  premiumSubscriptionCount?: number
  preferredLocale?: string
  publicUpdatesChannelID?: string
  maxVideoChannelUsers?: number
  approximateNumberCount?: number
  approximatePresenceCount?: number
  bans: GuildBans

  constructor(client: Client, data: GuildPayload) {
    super(client, data)
    this.id = data.id
    this.bans = new GuildBans(client, this)
    this.unavailable = data.unavailable
    this.members = new MembersManager(this.client, this)
    this.voiceStates = new GuildVoiceStatesManager(client, this)
    this.presences = new GuildPresencesManager(client, this)
    this.channels = new GuildChannelsManager(
      this.client,
      this.client.channels,
      this
    )
    this.roles = new RolesManager(this.client, this)
    this.emojis = new GuildEmojisManager(this.client, this.client.emojis, this)
    this.invites = new InviteManager(this.client, this)

    if (!this.unavailable) {
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
      this.features = data.features
      this.mfaLevel = data.mfa_level
      this.systemChannelID = data.system_channel_id
      this.systemChannelFlags = data.system_channel_flags
      this.rulesChannelID = data.rules_channel_id
      this.joinedAt = data.joined_at
      this.large = data.large
      this.memberCount = data.member_count
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

  readFromData(data: GuildPayload): void {
    this.id = data.id ?? this.id
    this.unavailable = data.unavailable ?? this.unavailable

    if (!this.unavailable) {
      this.name = data.name ?? this.name
      this.icon = data.icon ?? this.icon
      this.iconHash = data.icon_hash ?? this.iconHash
      this.splash = data.splash ?? this.splash
      this.discoverySplash = data.discovery_splash ?? this.discoverySplash
      this.owner = data.owner ?? this.owner
      this.ownerID = data.owner_id ?? this.ownerID
      this.permissions = data.permissions ?? this.permissions
      this.region = data.region ?? this.region
      this.afkTimeout = data.afk_timeout ?? this.afkTimeout
      this.afkChannelID = data.afk_channel_id ?? this.afkChannelID
      this.widgetEnabled = data.widget_enabled ?? this.widgetEnabled
      this.widgetChannelID = data.widget_channel_id ?? this.widgetChannelID
      this.verificationLevel = data.verification_level ?? this.verificationLevel
      this.defaultMessageNotifications =
        data.default_message_notifications ?? this.defaultMessageNotifications
      this.explicitContentFilter =
        data.explicit_content_filter ?? this.explicitContentFilter
      this.features = data.features ?? this.features
      this.mfaLevel = data.mfa_level ?? this.mfaLevel
      this.systemChannelID = data.system_channel_id ?? this.systemChannelID
      this.systemChannelFlags =
        data.system_channel_flags ?? this.systemChannelFlags
      this.rulesChannelID = data.rules_channel_id ?? this.rulesChannelID
      this.joinedAt = data.joined_at ?? this.joinedAt
      this.large = data.large ?? this.large
      this.memberCount = data.member_count ?? this.memberCount
      this.maxPresences = data.max_presences ?? this.maxPresences
      this.maxMembers = data.max_members ?? this.maxMembers
      this.vanityURLCode = data.vanity_url_code ?? this.vanityURLCode
      this.description = data.description ?? this.description
      this.banner = data.banner ?? this.banner
      this.premiumTier = data.premium_tier ?? this.premiumTier
      this.premiumSubscriptionCount =
        data.premium_subscription_count ?? this.premiumSubscriptionCount
      this.preferredLocale = data.preferred_locale ?? this.preferredLocale
      this.publicUpdatesChannelID =
        data.public_updates_channel_id ?? this.publicUpdatesChannelID
      this.maxVideoChannelUsers =
        data.max_video_channel_users ?? this.maxVideoChannelUsers
      this.approximateNumberCount =
        data.approximate_number_count ?? this.approximateNumberCount
      this.approximatePresenceCount =
        data.approximate_presence_count ?? this.approximatePresenceCount
    }
  }

  /**
   * Gets Everyone role of the Guild
   */
  async getEveryoneRole(): Promise<Role> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return (await this.roles.get(this.id)) as Role
  }

  /**
   * Gets current client's member in the Guild
   */
  async me(): Promise<Member> {
    const get = await this.members.get(this.client.user?.id as string)
    if (get === undefined) throw new Error('Guild#me is not cached')
    return get
  }

  /**
   * Fetches Guild's Integrations (Webhooks, Bots, etc.)
   */
  async fetchIntegrations(): Promise<GuildIntegration[]> {
    const raw = (await this.client.rest.get(
      GUILD_INTEGRATIONS(this.id)
    )) as GuildIntegrationPayload[]
    return raw.map((e) => new GuildIntegration(this.client, e))
  }

  /**
   * Chunks the Guild Members, i.e. cache them.
   * @param options Options regarding the Members Request
   * @param wait Whether to wait for all Members to come before resolving Promise or not.
   * @param timeout Configurable timeout to cancel the wait to safely remove listener.
   */
  async chunk(
    options: RequestMembersOptions,
    wait: boolean = false,
    timeout: number = 60000
  ): Promise<Guild> {
    return await new Promise((resolve, reject) => {
      this.client.gateway?.requestMembers(this.id, options)
      if (!wait) return resolve(this)
      else {
        let chunked = false
        const listener = (guild: Guild): void => {
          if (guild.id === this.id) {
            chunked = true
            this.client.removeListener('guildMembersChunked', listener)
            resolve(this)
          }
        }
        this.client.on('guildMembersChunked', listener)
        setTimeout(() => {
          if (!chunked) {
            this.client.removeListener('guildMembersChunked', listener)
          }
        }, timeout)
      }
      resolve(this)
    })
  }
}

export class GuildIntegration extends Base {
  id: string
  name: string
  type: string
  enabled: boolean
  syncing?: boolean
  roleID?: string
  enableEmoticons?: boolean
  expireBehaviour?: IntegrationExpireBehavior
  expireGracePeriod?: number
  user?: User
  account: IntegrationAccountPayload
  syncedAt?: string // Actually a ISO Timestamp, but we parse in constructor
  subscriberCount?: number
  revoked?: boolean
  application?: Application

  constructor(client: Client, data: GuildIntegrationPayload) {
    super(client, data)

    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.enabled = data.enabled
    this.syncing = data.syncing
    this.roleID = data.role_id
    this.enableEmoticons = data.enable_emoticons
    this.expireBehaviour = data.expire_behaviour
    this.expireGracePeriod = data.expire_grace_period
    this.user =
      data.user !== undefined ? new User(client, data.user) : undefined
    this.account = data.account
    this.syncedAt = data.synced_at
    this.subscriberCount = data.subscriber_count
    this.revoked = data.revoked
    this.application =
      data.application !== undefined
        ? new Application(client, data.application)
        : undefined
  }
}
