import { Channel } from "./channel.ts";
import type { GuildChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";

export class GuildChannel extends Channel {
  payload: GuildChannelPayload;
  constructor(client: Client, payload: GuildChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }

  get guildID(): string {
    return this.payload.guild_id;
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
  get topic(): string | null {
    return this.payload.topic;
  }
}
