import { Client } from '../models/client.ts'
import { Base } from './base.ts'
import { RoleModifyPayload, RolePayload } from '../types/role.ts'
import { Permissions } from '../utils/permissions.ts'
import { Guild } from './guild.ts'

export class Role extends Base {
  id: string
  guild: Guild
  name: string
  color: number
  hoist: boolean
  position: number
  permissions: Permissions
  managed: boolean
  mentionable: boolean
  tags?: RoleTags

  constructor(client: Client, data: RolePayload, guild: Guild) {
    super(client, data)
    this.id = data.id
    this.guild = guild
    this.name = data.name
    this.color = data.color
    this.hoist = data.hoist
    this.position = data.position
    this.permissions = new Permissions(data.permissions)
    this.managed = data.managed
    this.mentionable = data.mentionable
    this.tags =
      data.tags !== undefined
        ? {
            botID: data.tags?.bot_id,
            integrationID: data.tags?.integration_id,
            premiumSubscriber: 'premium_subscriber' in (data.tags ?? {})
          }
        : undefined
  }

  readFromData(data: RolePayload): void {
    this.name = data.name ?? this.name
    this.color = data.color ?? this.color
    this.hoist = data.hoist ?? this.hoist
    this.position = data.position ?? this.position
    this.permissions =
      data.permissions !== undefined
        ? new Permissions(data.permissions)
        : this.permissions
    this.managed = data.managed ?? this.managed
    this.mentionable = data.mentionable ?? this.mentionable
  }

  async delete(): Promise<Role | undefined> {
    return this.guild.roles.delete(this)
  }

  async edit(options: RoleModifyPayload): Promise<Role> {
    return this.guild.roles.edit(this, options)
  }
}

export interface RoleTags {
  /** The id of the bot who has this role */
  botID?: string
  /** Whether this is the premium subscriber role for this guild */
  premiumSubscriber: boolean
  /** The id of the integration this role belongs to */
  integrationID?: string
}
