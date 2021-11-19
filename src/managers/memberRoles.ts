import type { Client } from '../client/mod.ts'
import { BaseChildManager } from './baseChild.ts'
import type { RolePayload } from '../types/role.ts'
import { Role } from '../structures/role.ts'
import type { Member } from '../structures/member.ts'
import type { RolesManager } from './roles.ts'
import type { MemberPayload } from '../types/guild.ts'
import { GUILD_MEMBER_ROLE } from '../types/endpoint.ts'

export class MemberRolesManager extends BaseChildManager<RolePayload, Role> {
  member: Member

  constructor(client: Client, parent: RolesManager, member: Member) {
    super(client, parent)
    this.member = member
  }

  private async _resolveMemberPayload(): Promise<MemberPayload> {
    const cached = await this.member.guild.members._get(this.member.id)
    if (cached !== undefined) return cached
    else {
      const fetched = await this.client.rest.endpoints.getGuildMember(
        this.member.guild.id,
        this.member.id
      )
      await this.member.guild.members.set(fetched.user.id, fetched)
      return fetched
    }
  }

  async get(id: string): Promise<Role | undefined> {
    const res = await this.parent.get(id)
    const mem = await this._resolveMemberPayload()
    if (
      res !== undefined &&
      (mem.roles.includes(res.id) === true || res.id === this.member.guild.id)
    )
      return res
    else return undefined
  }

  async size(): Promise<number> {
    const payload = await this.member.guild.members._get(this.member.id)
    if (payload === undefined) return 0
    return payload.roles.length
  }

  async array(): Promise<Role[]> {
    const arr = await this.parent.array()
    const mem = await this._resolveMemberPayload()
    return arr.filter(
      (c) =>
        (mem.roles.includes(c.id) as boolean) || c.id === this.member.guild.id
    )
  }

  async flush(): Promise<boolean> {
    const arr = await this.array()
    for (const elem of arr) {
      this.parent._delete(elem.id)
    }
    return true
  }

  async add(role: string | Role, reason?: string): Promise<boolean> {
    await this.client.rest.put(
      GUILD_MEMBER_ROLE(
        this.member.guild.id,
        this.member.id,
        typeof role === 'string' ? role : role.id
      ),
      { reason },
      undefined,
      undefined,
      undefined,
      { reason }
    )

    return true
  }

  async remove(role: string | Role, reason?: string): Promise<boolean> {
    await this.client.rest.delete(
      GUILD_MEMBER_ROLE(
        this.member.guild.id,
        this.member.id,
        typeof role === 'string' ? role : role.id
      ),
      undefined,
      undefined,
      undefined,
      undefined,
      { reason }
    )

    return true
  }
}
