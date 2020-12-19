import { User } from '../structures/user.ts'
import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { Member } from '../structures/member.ts'
import { GUILD_MEMBER } from '../types/endpoint.ts'
import { MemberPayload } from '../types/guild.ts'
import { BaseManager } from './base.ts'
import { Permissions } from '../utils/permissions.ts'

export class MembersManager extends BaseManager<MemberPayload, Member> {
  guild: Guild

  constructor(client: Client, guild: Guild) {
    super(client, `members:${guild.id}`, Member)
    this.guild = guild
  }

  async get(key: string): Promise<Member | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return
    const user = new User(this.client, raw.user)
    const roles = await this.guild.roles.array()
    let permissions = new Permissions(Permissions.DEFAULT)
    if (roles !== undefined) {
      const mRoles = roles.filter(
        (r) => (raw.roles.includes(r.id) as boolean) || r.id === this.guild.id
      )
      permissions = new Permissions(mRoles.map((r) => r.permissions))
    }
    const res = new this.DataType(
      this.client,
      raw,
      user,
      this.guild,
      permissions
    )
    return res
  }

  async array(): Promise<Member[]> {
    let arr = await (this.client.cache.array(this.cacheName) as MemberPayload[])
    if (arr === undefined) arr = []

    return await Promise.all(
      arr.map(async (raw) => {
        const user = new User(this.client, raw.user)
        const roles = await this.guild.roles.array()
        let permissions = new Permissions(Permissions.DEFAULT)
        if (roles !== undefined) {
          const mRoles = roles.filter(
            (r) =>
              (raw.roles.includes(r.id) as boolean) || r.id === this.guild.id
          )
          permissions = new Permissions(mRoles.map((r) => r.permissions))
        }
        return new Member(this.client, raw, user, this.guild, permissions)
      })
    )
  }

  async fetch(id: string): Promise<Member> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD_MEMBER(this.guild.id, id))
        .then(async (data) => {
          await this.set(id, data as MemberPayload)
          const user: User = new User(this.client, data.user)
          const roles = await this.guild.roles.array()
          let permissions = new Permissions(Permissions.DEFAULT)
          if (roles !== undefined) {
            const mRoles = roles.filter(
              (r) =>
                (data.roles.includes(r.id) as boolean) || r.id === this.guild.id
            )
            permissions = new Permissions(mRoles.map((r) => r.permissions))
          }
          const res = new Member(
            this.client,
            data as MemberPayload,
            user,
            this.guild,
            permissions
          )
          resolve(res)
        })
        .catch((e) => reject(e))
    })
  }

  async fromPayload(members: MemberPayload[]): Promise<void> {
    for (const member of members) {
      await this.set(member.user.id, member)
    }
  }
}
