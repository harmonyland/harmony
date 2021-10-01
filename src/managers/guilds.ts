import { fetchAuto } from '../../deps.ts'
import type { Client } from '../client/mod.ts'
import { Guild } from '../structures/guild.ts'
import type { Template } from '../structures/template.ts'
import { Role } from '../structures/role.ts'
import { GUILD, GUILDS, GUILD_PREVIEW } from '../types/endpoint.ts'
import type {
  GuildPayload,
  MemberPayload,
  GuildCreateRolePayload,
  GuildCreatePayload,
  GuildCreateChannelPayload,
  GuildPreview,
  GuildPreviewPayload,
  GuildModifyOptions,
  GuildModifyPayload,
  GuildCreateOptions
} from '../types/guild.ts'
import { BaseManager } from './base.ts'
import { MembersManager } from './members.ts'
import { Emoji } from '../structures/emoji.ts'

export class GuildManager extends BaseManager<GuildPayload, Guild> {
  constructor(client: Client) {
    super(client, 'guilds', Guild)
  }

  async fetch(id: string): Promise<Guild> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD(id))
        .then(async (data) => {
          await this.set(id, data)

          const guild = new Guild(this.client, data)

          if ((data as GuildPayload).members !== undefined) {
            const members = new MembersManager(this.client, guild)
            await members.fromPayload(
              (data as GuildPayload).members as MemberPayload[]
            )
            guild.members = members
          }

          resolve(guild)
        })
        .catch((e) => reject(e))
    })
  }

  /** Create a new guild based on a template. */
  async createFromTemplate(
    template: Template | string,
    name: string,
    icon?: string
  ): Promise<Guild> {
    if (icon?.startsWith('http') === true) icon = await fetchAuto(icon)
    const guild = await this.client.rest.api.guilds.templates[
      typeof template === 'object' ? template.code : template
    ].post({ name, icon })
    return new Guild(this.client, guild)
  }

  /**
   * Creates a guild. Returns Guild. Fires guildCreate event.
   * @param options Options for creating a guild
   */
  async create(options: GuildCreateOptions): Promise<Guild> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (options.icon !== undefined && !options.icon.startsWith('data:')) {
      options.icon = await fetchAuto(options.icon)
    }
    if (options.roles !== undefined && options.roles[0].name !== '@everyone') {
      options.roles.unshift({
        id: Math.floor(Math.random() * 18392375458).toString(),
        name: '@everyone'
      })
    }

    const body: GuildCreatePayload = {
      name: options.name,
      region: options.region,
      icon: options.icon,
      verification_level: options.verificationLevel,
      roles: options.roles?.map((obj) => {
        let result: GuildCreateRolePayload
        if (obj instanceof Role) {
          result = {
            id: obj.id,
            name: obj.name,
            color: obj.color,
            hoist: obj.hoist,
            position: obj.position,
            permissions: obj.permissions.bitfield.toString(),
            managed: obj.managed,
            mentionable: obj.mentionable
          }
        } else {
          result = obj
        }

        return result
      }),
      channels: options.channels?.map(
        (obj): GuildCreateChannelPayload => ({
          id: obj.id,
          name: obj.name,
          type: obj.type,
          parent_id: obj.parentID
        })
      ),
      afk_channel_id: options.afkChannelID,
      afk_timeout: options.afkTimeout,
      system_channel_id: options.systemChannelID
    }

    const result: GuildPayload = await this.client.rest.post(GUILDS(), body)
    const guild = new Guild(this.client, result)

    return guild
  }

  /**
   * Gets a preview of a guild. Returns GuildPreview.
   * @param guildID Guild id
   */
  async preview(guildID: string): Promise<GuildPreview> {
    const resp: GuildPreviewPayload = await this.client.rest.get(
      GUILD_PREVIEW(guildID)
    )

    const result: GuildPreview = {
      id: resp.id,
      name: resp.name,
      icon: resp.icon,
      splash: resp.splash,
      discoverySplash: resp.discovery_splash,
      emojis: resp.emojis.map((emoji) => new Emoji(this.client, emoji)),
      features: resp.features,
      approximateMemberCount: resp.approximate_member_count,
      approximatePresenceCount: resp.approximate_presence_count,
      description: resp.description
    }

    return result
  }

  /** Sets a value to Cache */
  async set(key: string, value: GuildPayload): Promise<void> {
    value = { ...value }
    // Don't duplicate these in Guild cache as they have separate
    // caches already.
    if ('roles' in value) value.roles = []
    if ('emojis' in value) value.emojis = []
    if ('members' in value) value.members = []
    if ('presences' in value) value.presences = []
    if ('voice_states' in value) value.voice_states = []
    if ('threads' in value) value.threads = []
    if ('channels' in value) value.channels = []
    if ('stickers' in value) value.stickers = []
    await this.client.cache.set(this.cacheName, key, value)
  }

  /**
   * Edits a guild. Returns edited guild.
   * @param guild Guild or guild id
   * @param options Guild edit options
   * @param asRaw true for get raw data, false for get guild(defaults to false)
   */
  async edit(
    guild: Guild | string,
    options: GuildModifyOptions,
    asRaw: false
  ): Promise<Guild>
  async edit(
    guild: Guild | string,
    options: GuildModifyOptions,
    asRaw: true
  ): Promise<GuildPayload>
  async edit(
    guild: Guild | string,
    options: GuildModifyOptions,
    asRaw: boolean = false
  ): Promise<Guild | GuildPayload> {
    if (
      options.icon !== undefined &&
      options.icon !== null &&
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      !options.icon.startsWith('data:')
    ) {
      options.icon = await fetchAuto(options.icon)
    }
    if (
      options.splash !== undefined &&
      options.splash !== null &&
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      !options.splash.startsWith('data:')
    ) {
      options.splash = await fetchAuto(options.splash)
    }
    if (
      options.banner !== undefined &&
      options.banner !== null &&
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      !options.banner.startsWith('data:')
    ) {
      options.banner = await fetchAuto(options.banner)
    }
    if (guild instanceof Guild) {
      guild = guild.id
    }

    const body: GuildModifyPayload = {
      name: options.name,
      region: options.region,
      verification_level: options.verificationLevel,
      default_message_notifications: options.defaultMessageNotifications,
      explicit_content_filter: options.explicitContentFilter,
      afk_channel_id: options.afkChannelID,
      afk_timeout: options.afkTimeout,
      owner_id: options.ownerID,
      icon: options.icon,
      splash: options.splash,
      banner: options.banner,
      system_channel_id: options.systemChannelID,
      rules_channel_id: options.rulesChannelID,
      public_updates_channel_id: options.publicUpdatesChannelID,
      preferred_locale: options.preferredLocale
    }

    const result: GuildPayload = await this.client.rest.patch(
      GUILD(guild),
      body
    )

    if (asRaw) {
      const guild = new Guild(this.client, result)
      return guild
    } else {
      return result
    }
  }

  /**
   * Deletes a guild. Returns deleted guild.
   * @param guild Guild or guild id
   */
  async delete(guild: Guild | string): Promise<Guild | undefined> {
    if (guild instanceof Guild) {
      guild = guild.id
    }

    const oldGuild = await this.get(guild)

    await this.client.rest.delete(GUILD(guild))
    return oldGuild
  }

  /** Returns number of entries in Members Cache. Returns total of all guilds if guild param is not given */
  async memberCacheSize(guild?: string | Guild): Promise<number> {
    if (guild === undefined) {
      const guilds = (await this.client.cache.keys('guilds')) ?? []
      if (guilds.length === 0) return 0
      let size = 0
      for (const id of guilds) {
        size += await this.memberCacheSize(id)
      }
      return size
    }

    const id = typeof guild === 'object' ? guild.id : guild
    return (await this.client.cache.size(`members:${id}`)) ?? 0
  }
}
