import { User } from '../structures/user.ts'
import type { Client } from '../client/mod.ts'
import type { Guild } from '../structures/guild.ts'
import { Member } from '../structures/member.ts'
import { GUILD_MEMBER } from '../types/endpoint.ts'
import type { MemberPayload } from '../types/guild.ts'
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
    // it will always be present, see `set` impl for details
    const user = (await this.client.users.get(raw.user.id))!
    let permissions = new Permissions(raw.permissions ?? Permissions.DEFAULT)
    if (raw.permissions !== undefined) {
      const roles = await this.guild.roles.array()
      if (roles !== undefined) {
        const mRoles = roles.filter(
          (r) => (raw.roles.includes(r.id) as boolean) || r.id === this.guild.id
        )
        permissions = new Permissions(mRoles.map((r) => r.permissions))
      }
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

  async set(id: string, payload: MemberPayload): Promise<void> {
    await this.client.users.set(payload.user.id, payload.user)
    await super.set(id, payload)
  }

  async array(): Promise<Member[]> {
    let arr = await (this.client.cache.array(this.cacheName) as MemberPayload[])
    if (arr === undefined) arr = []
    const roles = await this.guild.roles.array()
    return await Promise.all(
      arr.map(async (raw) => {
        const user = new User(this.client, raw.user)
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

  /** Fetch a Guild Member */
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

  /** Fetch a list of Guild Members */
  async fetchList(limit?: number, after?: string): Promise<Member[]> {
    return await new Promise((resolve, reject) => {
      this.client.rest.endpoints
        .listGuildMembers(this.guild.id, { limit, after })
        .then(async (data) => {
          const roles = await this.guild.roles.array()
          const members: Member[] = []

          for (const member of data) {
            await this.set(member.user.id, member)
            const user = new User(this.client, member.user)
            let permissions = new Permissions(Permissions.DEFAULT)
            if (roles !== undefined) {
              const mRoles = roles.filter(
                (r) =>
                  (member.roles.includes(r.id) as boolean) ||
                  r.id === this.guild.id
              )
              permissions = new Permissions(mRoles.map((r) => r.permissions))
              members.push(
                new Member(this.client, member, user, this.guild, permissions)
              )
            }
          }

          resolve(members)
        })
        .catch((e) => reject(e))
    })
  }

  /** Search for Guild Members */
  async search(query: string, limit?: number): Promise<Member[]> {
    return await new Promise((resolve, reject) => {
      this.client.rest.endpoints
        .searchGuildMembers(this.guild.id, { query, limit })
        .then(async (data) => {
          const roles = await this.guild.roles.array()
          const members: Member[] = []

          for (const member of data) {
            await this.set(member.user.id, member)
            const user = new User(this.client, member.user)
            let permissions = new Permissions(Permissions.DEFAULT)
            if (roles !== undefined) {
              const mRoles = roles.filter(
                (r) =>
                  (member.roles.includes(r.id) as boolean) ||
                  r.id === this.guild.id
              )
              permissions = new Permissions(mRoles.map((r) => r.permissions))
              members.push(
                new Member(this.client, member, user, this.guild, permissions)
              )
            }
          }

          resolve(members)
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
