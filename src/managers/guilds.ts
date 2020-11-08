import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { GUILD } from '../types/endpoint.ts'
import { GuildPayload, MemberPayload } from '../types/guild.ts'
import { BaseManager } from './base.ts'
import { MembersManager } from './members.ts'

export class GuildManager extends BaseManager<GuildPayload, Guild> {
  constructor (client: Client) {
    super(client, 'guilds', Guild)
  }

  async fetch (id: string): Promise<Guild> {
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
        .catch(e => reject(e))
    })
  }
}
