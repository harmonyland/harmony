import { Client } from "../models/client.ts";
import { Guild } from "../structures/guild.ts";
import { GUILD } from "../types/endpoint.ts";
import { GuildPayload } from "../types/guildTypes.ts";
import { BaseManager } from "./BaseManager.ts";

export class GuildManager extends BaseManager<GuildPayload, Guild> {
  constructor(client: Client) {
    super(client, "guilds", Guild)
  }

  fetch(id: string) {
    return new Promise((res, rej) => {
      this.client.rest.get(GUILD(id)).then(data => {
        this.set(id, data as GuildPayload)
        res(new Guild(this.client, data as GuildPayload))
      }).catch(e => rej(e))
    })
  }
}