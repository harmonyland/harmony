import type { Client } from '../client/mod.ts'
import { TEMPLATE } from '../types/endpoint.ts'
import type { TemplatePayload } from '../types/template.ts'
import { Base } from './base.ts'
import { Guild } from './guild.ts'
import { User } from './user.ts'

export class Template extends Base {
  /** The template code (unique ID) */
  code: string
  /** The template name */
  name: string
  /** The description for the template */
  description: string | null
  /** Number of times this template has been used */
  usageCount: number
  /** The ID of the user who created the template */
  creatorID: string
  /** The user who created the template */
  creator: User
  /** When this template was created (in ms) */
  createdAt: number
  /** When this template was last synced to the source guild (in ms) */
  updatedAt: number
  /** The ID of the guild this template is based on */
  sourceGuildID: string
  /** The guild snapshot this template contains */
  serializedSourceGuild: Guild
  /** Whether the template has unsynced changes */
  isDirty: boolean | null

  constructor(client: Client, data: TemplatePayload) {
    super(client, data)
    this.code = data.code
    this.name = data.name
    this.description = data.description
    this.usageCount = data.usage_count
    this.creatorID = data.creator_id
    this.creator = new User(client, data.creator)
    this.createdAt = Date.parse(data.created_at)
    this.updatedAt = Date.parse(data.updated_at)
    this.sourceGuildID = data.source_guild_id
    this.serializedSourceGuild = new Guild(client, data.serialized_source_guild)
    this.isDirty = Boolean(data.is_dirty)
  }

  /** Modifies the template's metadata. Requires the MANAGE_GUILD permission. Returns the template object on success. */
  async edit(data: ModifyGuildTemplateParams): Promise<Template> {
    const res = await this.client.rest.patch(TEMPLATE(this.code), data)
    return new Template(this.client, res)
  }

  /** Deletes the template. Requires the MANAGE_GUILD permission. Returns the deleted template object on success. */
  async delete(): Promise<Template> {
    const res = await this.client.rest.delete(TEMPLATE(this.code))
    return new Template(this.client, res)
  }

  /** Syncs the template to the guild's current state. Requires the MANAGE_GUILD permission. Returns the template object on success. */
  async sync(): Promise<Template> {
    const res = await this.client.rest.put(TEMPLATE(this.code))
    return new Template(this.client, res)
  }
}

/** https://discord.com/developers/docs/resources/template#modify-guild-template-json-params */
export interface ModifyGuildTemplateParams {
  name?: string
  description?: string | null
}
