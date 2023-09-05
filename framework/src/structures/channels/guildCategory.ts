import type { GuildCategoryPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildCategory extends GuildChannel {
  payload: GuildCategoryPayload;
  constructor(client: Client, payload: GuildCategoryPayload) {
    super(client, payload);
    this.payload = payload;
  }
}
