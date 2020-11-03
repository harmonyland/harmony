import { Client } from "../models/client.ts";
import { Guild } from "../structures/guild.ts";
import { Member } from "../structures/member.ts";
import { GUILD_MEMBER } from "../types/endpoint.ts";
import { MemberPayload } from "../types/guild.ts";
import { BaseManager } from "./BaseManager.ts";

export class MembersManager extends BaseManager<MemberPayload, Member> {
  guild: Guild

  constructor(client: Client, guild: Guild) {
    super(client, `members:${guild.id}`, Member)
    this.guild = guild
  }

  async fetch(id: string): Promise<Member> {
    return await new Promise((resolve, reject) => {
      this.client.rest.get(GUILD_MEMBER(this.guild.id, id)).then(data => {
        this.set(id, data as MemberPayload)
        resolve(new Member(this.client, data as MemberPayload))
      }).catch(e => reject(e))
    })
  }

  async fromPayload(members: MemberPayload[]): Promise<void> {
    for(const member of members) {
      await this.set(member.user.id, member)
    }
  }
}