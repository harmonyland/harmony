import type { Client } from '../client/mod.ts'
import type { ApplicationPayload } from '../types/application.ts'
import { SnowflakeBase } from './base.ts'
import { User } from './user.ts'
import { Team } from './team.ts'

export class Application extends SnowflakeBase {
  id: string
  name: string
  icon: string
  description: string
  summary: string
  bot?: User
  team: Team | null

  constructor(client: Client, data: ApplicationPayload) {
    super(client, data)

    this.id = data.id
    this.name = data.name
    this.icon = data.icon
    this.description = data.description
    this.summary = data.summary
    this.bot = data.bot !== undefined ? new User(client, data.bot) : undefined
    this.team = data.team ? new Team(client, data.team) : null
  }
}
