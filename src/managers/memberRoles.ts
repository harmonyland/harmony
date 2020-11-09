import { Client } from '../models/client.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { BaseChildManager } from './baseChild.ts'
import { RolePayload } from "../types/role.ts"
import { Role } from "../structures/role.ts"
import { Member } from "../structures/member.ts"
import { RolesManager } from "./roles.ts"
import { MemberPayload } from "../types/guild.ts"

export class MemberRolesManager extends BaseChildManager<
  RolePayload,
  Role
> {
  member: Member

  constructor (client: Client, parent: RolesManager, member: Member) {
    super(client, parent as any)
    this.member = member
  }

  async get (id: string): Promise<Role | undefined> {
    const res = await this.parent.get(id)
    const mem = await (this.parent as any).guild.members.get(this.member.id) as MemberPayload
    if (res !== undefined && mem.roles.includes(res.id) === true) return res
    else return undefined
  }
  
  async delete(id: string): Promise<boolean> {
    return this.client.rest.delete(CHANNEL(id))
  }

  async array (): Promise<Role[]> {
    const arr = (await this.parent.array()) as Role[]
    const mem = await (this.parent as any).guild.members.get(this.member.id) as MemberPayload
    return arr.filter(
      (c: any) => mem.roles.includes(c.id)
    ) as any
  }

  async flush (): Promise<boolean> {
    const arr = await this.array()
    for (const elem of arr) {
      this.parent.delete(elem.id)
    }
    return true
  }
}
