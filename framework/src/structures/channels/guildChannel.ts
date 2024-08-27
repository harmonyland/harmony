import { Channel } from "./channel.ts";
import type { GuildChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { Guild } from "../guilds/guild.ts";

export class GuildChannel extends Channel {
  payload: GuildChannelPayload;
  constructor(client: Client, payload: GuildChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }

  get guildID(): string {
    return this.payload.guild_id;
  }
  get guild(): Guild | undefined {
    return this.client.guilds.get(this.payload.guild_id);
  }
  get name(): string {
    return this.payload.name;
  }
  get position(): number {
    return this.payload.position;
  }
  // get permissionOverwrites(): Overwrite[] {
  //   return this.payload.permission_overwrites;
  // }
  get nsfw(): boolean {
    return this.payload.nsfw;
  }
  get parentID(): string | null {
    return this.payload.parent_id;
  }
  get parent(): GuildChannel | undefined {
    return this.client.channels.get(this.payload.parent_id!) as GuildChannel;
  }
  get topic(): string | null {
    return this.payload.topic;
  }
}
