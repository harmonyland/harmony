import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { Role } from '../structures/role.ts'
import { GUILD_ROLE } from '../types/endpoint.ts'
import { RolePayload } from '../types/role.ts'
import { BaseManager } from './BaseManager.ts'

export class RolesManager extends BaseManager<RolePayload, Role> {
  guild: Guild

  constructor (client: Client, guild: Guild) {
    super(client, `roles:${guild.id}`, Role)
    this.guild = guild
  }

  async fetch (id: string): Promise<Role> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD_ROLE(this.guild.id, id))
        .then(data => {
          this.set(id, data as RolePayload)
          resolve(new Role(this.client, data as RolePayload))
        })
        .catch(e => reject(e))
    })
  }

  async fromPayload(roles: RolePayload[]) {
    for(const role of roles) {
      await this.set(role.id, role)
    }
    return true
  }
}
