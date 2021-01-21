import { fetchAuto } from '../../deps.ts'
import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { Template } from '../structures/template.ts'
import { GUILD } from '../types/endpoint.ts'
import { GuildPayload, MemberPayload } from '../types/guild.ts'
import { BaseManager } from './base.ts'
import { MembersManager } from './members.ts'

export class GuildManager extends BaseManager<GuildPayload, Guild> {
  constructor(client: Client) {
    super(client, 'guilds', Guild)
  }

  async fetch(id: string): Promise<Guild> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD(id))
        .then(async (data: any) => {
          this.set(id, data)

          const guild = new Guild(this.client, data)

          if ((data as GuildPayload).members !== undefined) {
            const members = new MembersManager(this.client, guild)
            await members.fromPayload(
              (data as GuildPayload).members as MemberPayload[]
            )
            guild.members = members
          }

          resolve(guild)
        })
        .catch((e) => reject(e))
    })
  }

  /** Create a new guild based on a template. */
  async createFromTemplate(
    template: Template | string,
    name: string,
    icon?: string
  ): Promise<Guild> {
    if (icon?.startsWith('http') === true) icon = await fetchAuto(icon)
    const guild = await this.client.rest.api.guilds.templates[
      typeof template === 'object' ? template.code : template
    ].post({ name, icon })
    return new Guild(this.client, guild)
  }
}
