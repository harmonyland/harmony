import cache from '../models/cache.ts'
import { Client } from '../models/client.ts'
import { Base } from './base.ts'
import { RolePayload } from '../types/role.ts'

export class Role extends Base {
  id: string
  name: string
  color: number
  hoist: boolean
  position: number
  permissions: string
  managed: boolean
  mentionable: boolean

  get mention (): string {
    return `<@&${this.id}>`
  }

  constructor (client: Client, data: RolePayload) {
    super(client, data)
    this.id = data.id
    this.name = data.name
    this.color = data.color
    this.hoist = data.hoist
    this.position = data.position
    this.permissions = data.permissions
    this.managed = data.managed
    this.mentionable = data.mentionable
    cache.set('role', this.id, this)
  }

  protected readFromData (data: RolePayload): void {
    super.readFromData(data)
    this.name = data.name ?? this.name
    this.color = data.color ?? this.color
    this.hoist = data.hoist ?? this.hoist
    this.position = data.position ?? this.position
    this.permissions = data.permissions ?? this.permissions
    this.managed = data.managed ?? this.managed
    this.mentionable = data.mentionable ?? this.mentionable
  }
}
