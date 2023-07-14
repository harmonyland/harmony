import type { GuildThreadAvailableChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildThreadAvailableChannel extends GuildChannel {
  constructor(client: Client, payload: GuildThreadAvailableChannelPayload) {
    super(client, payload);
  }
}
