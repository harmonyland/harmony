import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { GUILD } from '../types/endpoint.ts'
import { GuildPayload } from '../types/guild.ts'
import { BaseManager } from './BaseManager.ts'

export class GuildManager extends BaseManager<GuildPayload, Guild> {
  constructor (client: Client) {
    super(client, 'guilds', Guild)
  }

  async fetch (id: string): Promise<Guild> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD(id))
        .then(data => {
          this.set(id, data as GuildPayload)
          resolve(new Guild(this.client, data as GuildPayload))
        })
        .catch(e => reject(e))
    })
  }
}
