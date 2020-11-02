import { Client } from "../models/client.ts";
import { Guild } from "../structures/guild.ts";
import { Member } from "../structures/member.ts";
import { Role } from "../structures/role.ts";
import { GUILD_MEMBER, GUILD_ROLE } from "../types/endpoint.ts";
import { MemberPayload } from "../types/guild.ts";
import { RolePayload } from "../types/role.ts";
import { BaseManager } from "./BaseManager.ts";

export class MembersManager extends BaseManager<MemberPayload, Member> {
  guild: Guild

  constructor(client: Client, guild: Guild) {
    super(client, `g${guild.id}m`, Member)
    this.guild = guild
  }

  fetch(id: string) {
    return new Promise((res, rej) => {
      this.client.rest.get(GUILD_MEMBER(this.guild.id, id)).then(data => {
        this.set(id, data as MemberPayload)
        res(new Member(this.client, data as MemberPayload))
      }).catch(e => rej(e))
    })
  }

  async fromPayload(members: MemberPayload[]) {
    for(const member of members) {
      await this.set(member.user.id, member)
    }
  }
}