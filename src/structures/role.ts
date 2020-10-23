import { Client } from '../models/client.ts'
import { Base } from './base.ts'
import { RolePayload } from '../types/roleTypes.ts'

export class Role extends Base implements RolePayload {
  id: string
  name: string
  color: number
  hoist: boolean
  position: number
  permissions: string
  managed: boolean
  mentionable: boolean

  get mention () {
    return `<@&${this.id}>`
  }

  constructor (client: Client, data: RolePayload) {
    super(client)
    this.id = data.id
    this.name = data.name
    this.color = data.color
    this.hoist = data.hoist
    this.position = data.position
    this.permissions = data.permissions
    this.managed = data.managed
    this.mentionable = data.mentionable
  }
}
