import { User } from '../structures/user.ts'
import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { Member } from '../structures/member.ts'
import { GUILD_MEMBER } from '../types/endpoint.ts'
import { MemberPayload } from '../types/guild.ts'
import { BaseManager } from './base.ts'

export class MembersManager extends BaseManager<MemberPayload, Member> {
  guild: Guild

  constructor(client: Client, guild: Guild) {
    super(client, `members:${guild.id}`, Member)
    this.guild = guild
  }

  async get (key: string): Promise<Member | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return
    const user = new User(this.client, raw.user)
    const res = new this.DataType(this.client, raw, user)
    for (const roleid of res.roleIDs as string[]) {
      const role = await this.guild.roles.get(roleid)
      if (role !== undefined) res.roles.push(role)
    }
    return res
  }

  async fetch(id: string): Promise<Member> {
    return await new Promise((resolve, reject) => {
      this.client.rest.get(GUILD_MEMBER(this.guild.id, id)).then(async data => {
        await this.set(id, data as MemberPayload)
        const user: User = new User(this.client, data.user)
        const res = new Member(this.client, data as MemberPayload, user)
        for (const roleid of res.roleIDs as string[]) {
          const role = await this.guild.roles.get(roleid)
          if (role !== undefined) res.roles.push(role)
        }
        resolve(res)
      }).catch(e => reject(e))
    })
  }

  async fromPayload(members: MemberPayload[]): Promise<void> {
    for (const member of members) {
      await this.set(member.user.id, member)
    }
  }
}