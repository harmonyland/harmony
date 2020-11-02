import { guildBanAdd } from "../gateway/handlers/guildBanAdd.ts";
import { Client } from "../models/client.ts";
import { Guild } from "../structures/guild.ts";
import { GUILD } from "../types/endpoint.ts";
import { GuildPayload, MemberPayload } from "../types/guild.ts";
import { BaseManager } from "./BaseManager.ts";
import { MembersManager } from "./MembersManager.ts";

export class GuildManager extends BaseManager<GuildPayload, Guild> {
  constructor (client: Client) {
    super(client, 'guilds', Guild)
  }

  fetch(id: string) {
    return new Promise((res, rej) => {
      this.client.rest.get(GUILD(id)).then(async (data: any) => {
        this.set(id, data)
        let guild = new Guild(this.client, data)
        if((data as GuildPayload).members) {
          let members = new MembersManager(this.client, guild)
          await members.fromPayload((data as GuildPayload).members as MemberPayload[])
          guild.members = members
        }
        res(guild)
      }).catch(e => rej(e))
    })
  }
}
