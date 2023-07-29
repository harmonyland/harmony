import type { GuildThreadAvailableChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildThreadAvailableChannel<
  T extends GuildThreadAvailableChannelPayload,
> extends GuildChannel<T> {
  constructor(client: Client, payload: T) {
    super(client, payload);
  }
}
