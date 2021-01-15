import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { Role } from '../structures/role.ts'
import { GUILD, GUILDS } from '../types/endpoint.ts'
import {
  GuildChannels,
  GuildPayload,
  MemberPayload,
  GuildCreateRolePayload,
  GuildCreatePayload,
  Verification,
  GuildCreateChannelOptions,
  GuildCreateChannelPayload
} from '../types/guild.ts'
import { BaseManager } from './base.ts'
import { MembersManager } from './members.ts'
import { fetchAuto } from '../../deps.ts'

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

export class GuildManager extends BaseManager<GuildPayload, Guild> {
  constructor(client: Client) {
    super(client, 'guilds', Guild)
  }

  async fetch(id: string): Promise<Guild> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD(id))
        .then(async (data: any) => {
          this.set(id, data)

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

  async create(options: GuildCreateOptions): Promise<Guild> {
    if (options.icon !== undefined && !options.icon.startsWith('data:')) {
      options.icon = await fetchAuto(options.icon)
    }

    const body: GuildCreatePayload = {
      name: options.name,
      region: options.region,
      icon: options.icon,
      verification_level: options.verificationLevel,
      roles:
        options.roles !== undefined
          ? options.roles.map((obj) => {
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
            })
          : undefined,
      channels:
        options.channels !== undefined
          ? options.channels.map(
              (obj): GuildCreateChannelPayload => ({
                id: obj.id,
                name: obj.name,
                type: obj.type,
                parent_id: obj.parentID
              })
            )
          : undefined,
      afk_channel_id: options.afkChannelID,
      afk_timeout: options.afkTimeout,
      system_channel_id: options.systemChannelID
    }

    const result: GuildPayload = await this.client.rest.post(GUILDS(), body)
    const guild = new Guild(this.client, result)

    return guild
  }
}
