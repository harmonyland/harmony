import { Channel } from "./channel.ts";
import type { Client } from "../../client/mod.ts";
import type { GuildChannelPayload } from "../../../../types/mod.ts";

export class GuildChannel extends Channel {
  guildID: string;
  name: string;
  position: number;
  // permissionOverwrites: Overwrite[];
  nsfw: boolean;
  parentID: string | null;
  topic: string | null;

  constructor(client: Client, payload: GuildChannelPayload) {
    super(client, payload);
    this.guildID = payload.guild_id;
    this.name = payload.name;
    this.position = payload.position;
    // this.permissionOverwrites = payload.permission_overwrites;
    this.nsfw = payload.nsfw;
    this.parentID = payload.parent_id;
    this.topic = payload.topic;
  }
}
