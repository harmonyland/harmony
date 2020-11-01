import { Client } from "../models/client.ts";
import { Guild } from "../structures/guild.ts";
import { Role } from "../structures/role.ts";
import { GUILD_ROLE } from "../types/endpoint.ts";
import { RolePayload } from "../types/role.ts";
import { BaseManager } from "./BaseManager.ts";

export class RolesManager extends BaseManager<RolePayload, Role> {
  guild: Guild

  constructor(client: Client, guild: Guild) {
    super(client, "roles:" + guild.id, Role)
    this.guild = guild
  }

  fetch(id: string) {
    return new Promise((res, rej) => {
      this.client.rest.get(GUILD_ROLE(this.guild.id, id)).then(data => {
        this.set(id, data as RolePayload)
        res(new Role(this.client, data as RolePayload))
      }).catch(e => rej(e))
    })
  }

  async fromPayload(roles: RolePayload[]) {
    for(const role of roles) {
      await this.guild.roles.set(role.id, role)
    }
  }
}