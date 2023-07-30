import type { GuildThreadAvailableChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildThreadAvailableChannel<
  P extends GuildThreadAvailableChannelPayload,
> extends GuildChannel<P> {
  constructor(client: Client, payload: P) {
    super(client, payload);
  }
}
