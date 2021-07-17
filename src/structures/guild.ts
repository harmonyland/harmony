import type { Client } from '../client/mod.ts'
import {
  GuildBanPayload,
  GuildFeatures,
  GuildIntegrationPayload,
  GuildPayload,
  GuildWidgetPayload,
  IntegrationAccountPayload,
  IntegrationExpireBehavior,
  Verification,
  GuildChannels,
  GuildPreview,
  MessageNotification,
  ContentFilter,
  GuildModifyOptions,
  GuildGetPruneCountPayload,
  GuildPruneCountPayload,
  GuildBeginPrunePayload,
  AuditLog,
  AuditLogEvents,
  AuditLogEntryPayload,
  AuditLogEntry
} from '../types/guild.ts'
import { Base, SnowflakeBase } from './base.ts'
import { CreateGuildRoleOptions, RolesManager } from '../managers/roles.ts'
import { InviteManager } from '../managers/invites.ts'
import {
  CreateChannelOptions,
  GuildChannelsManager
} from '../managers/guildChannels.ts'
import { MembersManager } from '../managers/members.ts'
import { Role } from './role.ts'
import { GuildEmojisManager } from '../managers/guildEmojis.ts'
import { Member } from './member.ts'
import { User } from './user.ts'
import { Application } from './application.ts'
import {
  GUILD_BAN,
  GUILD_BANNER,
  GUILD_BANS,
  GUILD_DISCOVERY_SPLASH,
  GUILD_ICON,
  GUILD_INTEGRATIONS,
  GUILD_PRUNE,
  GUILD_SPLASH
} from '../types/endpoint.ts'
import { GuildVoiceStatesManager } from '../managers/guildVoiceStates.ts'
import type { RequestMembersOptions } from '../gateway/mod.ts'
import { GuildPresencesManager } from '../managers/presences.ts'
import type { TemplatePayload } from '../types/template.ts'
import { Template } from './template.ts'
import { DiscordAPIError } from '../rest/mod.ts'
import type { ImageFormats, ImageSize } from '../types/cdn.ts'
import { ImageURL } from './cdn.ts'
import type { GuildSlashCommandsManager } from '../interactions/slashCommand.ts'
import { toCamelCase } from '../utils/snakeCase.ts'
import { ThreadsManager } from '../managers/threads.ts'

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

export class GuildBans extends Base {
  guild: Guild

  constructor(client: Client, guild: Guild) {
    super(client)
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

export class Guild extends SnowflakeBase {
  id: string
  name?: string
  icon?: string
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
  verificationLevel?: Verification
  defaultMessageNotifications?: MessageNotification
  explicitContentFilter?: ContentFilter
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
  nsfw?: boolean
  commands: GuildSlashCommandsManager
  threads: ThreadsManager

  /** Get Shard ID of Guild on which it is */
  get shardID(): number {
    return Number((BigInt(this.id) << 22n) % BigInt(this.client.shardCount))
  }

  constructor(client: Client, data: GuildPayload) {
    super(client, data)
    this.id = data.id
    this.unavailable = data.unavailable ?? false
    this.readFromData(data)
    this.bans = new GuildBans(client, this)
    this.members = new MembersManager(this.client, this)
    this.voiceStates = new GuildVoiceStatesManager(client, this)
    this.presences = new GuildPresencesManager(client, this)
    this.channels = new GuildChannelsManager(
      this.client,
      this.client.channels,
      this
    )
    this.threads = new ThreadsManager(client, this.channels)
    this.roles = new RolesManager(this.client, this)
    this.emojis = new GuildEmojisManager(this.client, this.client.emojis, this)
    this.invites = new InviteManager(this.client, this)
    this.commands = this.client.slash.commands.for(this)
  }

  readFromData(data: GuildPayload): void {
    this.id = data.id ?? this.id
    this.unavailable = data.unavailable ?? this.unavailable

    if (!this.unavailable) {
      this.name = data.name ?? this.name
      this.icon = data.icon ?? this.icon
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
      this.nsfw = data.nsfw ?? this.nsfw ?? false
    }
  }

  /**
   * Gets guild icon URL
   */
  iconURL(
    format: ImageFormats = 'png',
    size: ImageSize = 512
  ): string | undefined {
    return this.icon != null
      ? `${ImageURL(GUILD_ICON(this.id, this.icon), format, size)}`
      : undefined
  }

  /**
   * Gets guild splash URL
   */
  splashURL(
    format: ImageFormats = 'png',
    size: ImageSize = 512
  ): string | undefined {
    return this.splash != null
      ? `${ImageURL(GUILD_SPLASH(this.id, this.splash), format, size)}`
      : undefined
  }

  /**
   * Gets guild discover splash URL
   */
  discoverSplashURL(
    format: ImageFormats = 'png',
    size: ImageSize = 512
  ): string | undefined {
    return this.discoverySplash != null
      ? `${ImageURL(
          GUILD_DISCOVERY_SPLASH(this.id, this.discoverySplash),
          format,
          size
        )}`
      : undefined
  }

  /**
   * Gets guild banner URL
   */
  bannerURL(
    format: ImageFormats = 'png',
    size: ImageSize = 512
  ): string | undefined {
    return this.banner != null
      ? `${ImageURL(GUILD_BANNER(this.id, this.banner), format, size)}`
      : undefined
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

  /** Create a new Guild Channel */
  async createChannel(options: CreateChannelOptions): Promise<GuildChannels> {
    return this.channels.create(options)
  }

  /** Create a new Guild Role */
  async createRole(options?: CreateGuildRoleOptions): Promise<Role> {
    return this.roles.create(options)
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
      this.client.shards.get(this.shardID)?.requestMembers(this.id, options)
      if (!wait) return resolve(this)
      else {
        let chunked = false
        const listener = (guild: Guild): void => {
          if (guild.id === this.id) {
            chunked = true
            this.client.off('guildMembersChunked', listener)
            resolve(this)
          }
        }
        this.client.on('guildMembersChunked', listener)
        setTimeout(() => {
          if (!chunked) {
            this.client.off('guildMembersChunked', listener)
          }
        }, timeout)
      }
    })
  }

  /**
   * Fulfills promise when guild becomes available
   * @param timeout Configurable timeout to cancel the wait to safely remove listener.
   */
  async awaitAvailability(timeout: number = 1000): Promise<Guild> {
    return await new Promise((resolve, reject) => {
      if (!this.unavailable) resolve(this)
      const listener = (guild: Guild): void => {
        if (guild.id === this.id) {
          this.client.off('guildLoaded', listener)
          resolve(this)
        }
      }
      this.client.on('guildLoaded', listener)
      setTimeout(() => {
        this.client.off('guildLoaded', listener)
        reject(Error("Timeout. Guild didn't arrive in time."))
      }, timeout)
    })
  }

  /** Attach an integration object from the current user to the guild. */
  async createIntegration(id: string, type: string): Promise<Guild> {
    await this.client.rest.api.guilds[this.id].integrations.post({ id, type })
    return this
  }

  /** Modify the behavior and settings of an integration object for the guild. */
  async editIntegration(
    id: string,
    data: {
      expireBehavior?: number | null
      expireGracePeriod?: number | null
      enableEmoticons?: boolean | null
    }
  ): Promise<Guild> {
    await this.client.rest.api.guilds[this.id].integrations[id].patch({
      expire_behaviour: data.expireBehavior,
      expire_grace_period: data.expireGracePeriod,
      enable_emoticons: data.enableEmoticons
    })
    return this
  }

  /** Delete the attached integration object for the guild. Deletes any associated webhooks and kicks the associated bot if there is one. */
  async deleteIntegration(id: string): Promise<Guild> {
    await this.client.rest.api.guilds[this.id].integrations[id].delete()
    return this
  }

  /** Sync an integration. */
  async syncIntegration(id: string): Promise<Guild> {
    await this.client.rest.api.guilds[this.id].integrations[id].sync.post()
    return this
  }

  /** Returns the widget for the guild. */
  async getWidget(): Promise<GuildWidgetPayload> {
    return this.client.rest.api.guilds[this.id]['widget.json'].get()
  }

  /** Modify a guild widget object for the guild. */
  async editWidget(data: {
    enabled?: boolean
    channel?: string | GuildChannels
  }): Promise<Guild> {
    await this.client.rest.api.guilds[this.id].widget.patch({
      enabled: data.enabled,
      channel_id:
        typeof data.channel === 'object' ? data.channel.id : data.channel
    })
    return this
  }

  /** Returns a partial invite object for guilds with that feature enabled. */
  async getVanity(): Promise<{ code: string | null; uses: number }> {
    try {
      const value = await this.client.rest.api.guilds[this.id][
        'vanity-url'
      ].get()
      return value
    } catch (error) {
      if (error instanceof DiscordAPIError) {
        if (error.error?.code === 50020) {
          return {
            code: null,
            uses: 0
          }
        }
      }
      throw error
    }
  }

  /** Returns a PNG (URL) image widget for the guild. */
  getWidgetImageURL(
    style?: 'shield' | 'banner1' | 'banner2' | 'banner3' | 'banner4'
  ): string {
    return `https://discord.com/api/v${this.client.rest.version ?? 8}/guilds/${
      this.id
    }/widget.png${style !== undefined ? `?style=${style}` : ''}`
  }

  /** Leave a Guild. */
  async leave(): Promise<Client> {
    await this.client.rest.api.users['@me'].guilds[this.id].delete()
    return this.client
  }

  /** Returns an array of template objects. */
  async getTemplates(): Promise<Template[]> {
    return this.client.rest.api.guilds[this.id].templates
      .get()
      .then((temps: TemplatePayload[]) =>
        temps.map((temp) => new Template(this.client, temp))
      )
  }

  /** Creates a template for the guild. */
  async createTemplate(
    name: string,
    description?: string | null
  ): Promise<Template> {
    const payload = await this.client.rest.api.guilds[this.id].templates.post({
      name,
      description
    })
    return new Template(this.client, payload)
  }

  /** Syncs the template to the guild's current state. */
  async syncTemplate(code: string): Promise<Template> {
    const payload = await this.client.rest.api.guilds[this.id].templates[
      code
    ].put()
    return new Template(this.client, payload)
  }

  /** Modifies the template's metadata. */
  async editTemplate(
    code: string,
    data: { name?: string; description?: string }
  ): Promise<Template> {
    const payload = await this.client.rest.api.guilds[this.id].templates[
      code
    ].patch({ name: data.name, description: data.description })
    return new Template(this.client, payload)
  }

  /** Deletes the template. Requires the MANAGE_GUILD permission. */
  async deleteTemplate(code: string): Promise<Guild> {
    await this.client.rest.api.guilds[this.id].templates[code].delete()
    return this
  }

  /** Gets a preview of the guild. Returns GuildPreview. */
  async preview(): Promise<GuildPreview> {
    return this.client.guilds.preview(this.id)
  }

  /**
   * Edits the guild.
   * @param options Guild edit options
   */
  async edit(options: GuildModifyOptions): Promise<Guild> {
    const result = await this.client.guilds.edit(this.id, options, true)
    this.readFromData(result)

    return new Guild(this.client, result)
  }

  /** Deletes the guild. */
  async delete(): Promise<Guild> {
    const result = await this.client.guilds.delete(this.id)

    return result === undefined ? this : result
  }

  async getPruneCount(options?: {
    days?: number
    includeRoles?: Array<Role | string>
  }): Promise<number> {
    const query: GuildGetPruneCountPayload = {
      days: options?.days,
      include_roles: options?.includeRoles
        ?.map((role) => (role instanceof Role ? role.id : role))
        .join(',')
    }

    const result: GuildPruneCountPayload = await this.client.rest.get(
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      GUILD_PRUNE(this.id) +
        '?' +
        Object.entries(query)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
    )

    return result.pruned as number
  }

  async prune(options?: {
    days?: number
    computePruneCount?: true
    includeRoles?: Array<Role | string>
  }): Promise<number>
  async prune(options?: {
    days?: number
    computePruneCount: false
    includeRoles?: Array<Role | string>
  }): Promise<null>
  async prune(options?: {
    days?: number
    computePruneCount?: boolean
    includeRoles?: Array<Role | string>
  }): Promise<number | null> {
    const body: GuildBeginPrunePayload = {
      days: options?.days,
      compute_prune_count: options?.computePruneCount,
      include_roles: options?.includeRoles?.map((role) =>
        role instanceof Role ? role.id : role
      )
    }

    const result: GuildPruneCountPayload = await this.client.rest.post(
      GUILD_PRUNE(this.id),
      body
    )

    return result.pruned
  }

  async fetchAuditLog(
    options: {
      user?: string | User
      actionType?: AuditLogEvents
      before?: string
      limit?: number
    } = {}
  ): Promise<AuditLog> {
    if (
      typeof options.limit === 'number' &&
      (options.limit < 1 || options.limit > 100)
    )
      throw new Error('Invalid limit, must be between 1-100')

    const data = await this.client.rest.endpoints.getGuildAuditLog(this.id, {
      userId: typeof options.user === 'object' ? options.user.id : options.user,
      actionType: options.actionType,
      before: options.before,
      limit: options.limit ?? 50
    })

    const ret: AuditLog = {
      webhooks: [],
      users: [],
      entries: [],
      integrations: []
    }

    if ('audit_log_entries' in data) {
      ret.entries = data.audit_log_entries.map(transformAuditLogEntryPayload)
    }

    if ('users' in data) {
      const users: User[] = []
      for (const d of data.users) {
        await this.client.users.set(d.id, d)
        users.push((await this.client.users.get(d.id))!)
      }
      ret.users = users
    }

    if ('integrations' in data) {
      ret.integrations = data.integrations.map(
        (e) => new GuildIntegration(this.client, e)
      )
    }

    if ('webhooks' in data) {
      ret.webhooks = data.webhooks
    }

    return ret
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

function transformAuditLogEntryPayload(d: AuditLogEntryPayload): AuditLogEntry {
  return toCamelCase(d)
}
