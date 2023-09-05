import type { GuildThreadAvailableChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildThreadAvailableChannel extends GuildChannel {
  payload: GuildThreadAvailableChannelPayload;
  constructor(client: Client, payload: GuildThreadAvailableChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }

  get defaultAutoArchiveDuration() {
    return this.payload.default_auto_archive_duration;
  }

  get defaultThreadRateLimitPerUser() {
    return this.payload.default_auto_archive_duration;
  }
}
