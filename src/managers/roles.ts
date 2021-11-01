import { Permissions } from '../../mod.ts'
import { fetchAuto } from '../../deps.ts'
import type { Client } from '../client/mod.ts'
import type { Guild } from '../structures/guild.ts'
import { Role } from '../structures/role.ts'
import { GUILD_ROLE, GUILD_ROLES } from '../types/endpoint.ts'
import type { RoleModifyPayload, RolePayload } from '../types/role.ts'
import { BaseManager } from './base.ts'

export interface CreateGuildRoleOptions {
  name?: string
  permissions?: number | string | Permissions
  color?: number | string
  hoist?: boolean
  mentionable?: boolean
}

export class RolesManager extends BaseManager<RolePayload, Role> {
  guild: Guild

  constructor(client: Client, guild: Guild) {
    super(client, `roles:${guild.id}`, Role)
    this.guild = guild
  }

  /** Fetch All Guild Roles */
  async fetchAll(): Promise<Role[]> {
    return await new Promise((resolve, reject) => {
      this.client.rest.api.guilds[this.guild.id].roles
        .get()
        .then(async (data: RolePayload[]) => {
          const roles: Role[] = []
          for (const raw of data) {
            await this.set(raw.id, raw)
            roles.push(new Role(this.client, raw, this.guild))
          }
          resolve(roles)
        })
        .catch((e) => reject(e))
    })
  }

  async get(key: string): Promise<Role | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return
    return new Role(this.client, raw, this.guild)
  }

  async array(): Promise<Role[]> {
    let arr = await (this.client.cache.array(this.cacheName) as RolePayload[])
    if (arr === undefined) arr = []
    return arr.map((e) => new Role(this.client, e, this.guild))
  }

  async fromPayload(roles: RolePayload[]): Promise<boolean> {
    for (const role of roles) {
      await this.set(role.id, role)
    }
    return true
  }

  /** Create a Guild Role */
  async create(data?: CreateGuildRoleOptions): Promise<Role> {
    if (typeof data?.color === 'string') {
      if (data.color.startsWith('#')) data.color = data.color.slice(1)
    }

    const roleRaw = (await this.client.rest.post(GUILD_ROLES(this.guild.id), {
      name: data?.name,
      permissions:
        data?.permissions === undefined
          ? undefined
          : (typeof data.permissions === 'object'
              ? data.permissions.bitfield
              : data.permissions
            ).toString(),
      color:
        data?.color === undefined
          ? undefined
          : typeof data.color === 'string'
          ? isNaN(parseInt(data.color, 16))
            ? 0
            : parseInt(data.color, 16)
          : data.color,
      hoist: data?.hoist ?? false,
      mentionable: data?.mentionable ?? false
    })) as unknown as RolePayload

    await this.set(roleRaw.id, roleRaw)
    return (await this.get(roleRaw.id)) as unknown as Role
  }

  /** Delete a Guild Role */
  async delete(role: Role | string): Promise<Role | undefined> {
    const oldRole = await this.get(typeof role === 'object' ? role.id : role)

    await this.client.rest.delete(
      GUILD_ROLE(this.guild.id, typeof role === 'object' ? role.id : role)
    )

    return oldRole
  }

  async edit(role: Role | string, options: RoleModifyPayload): Promise<Role> {
    if (
      options.icon !== undefined &&
      options.icon !== null &&
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      !options.icon.startsWith('data:')
    ) {
      options.icon = await fetchAuto(options.icon)
    }
    if (role instanceof Role) {
      role = role.id
    }
    const resp: RolePayload = await this.client.rest.patch(
      GUILD_ROLE(this.guild.id, role),
      {
        name: options.name,
        permissions: options.permissions,
        color: options.color,
        hoist: options.hoist,
        icon: options.icon,
        unicode_emoji: options.unicodeEmoji,
        mentionable: options.mentionable
      }
    )

    return new Role(this.client, resp, this.guild)
  }

  /** Modify the positions of a set of role positions for the guild. */
  async editPositions(
    ...positions: Array<{ id: string | Role; position: number | null }>
  ): Promise<RolesManager> {
    if (positions.length === 0)
      throw new Error('No role positions to change specified')

    await this.client.rest.api.guilds[this.guild.id].roles.patch(
      positions.map((e) => ({
        id: typeof e.id === 'string' ? e.id : e.id.id,
        position: e.position ?? null
      }))
    )
    return this
  }
}
