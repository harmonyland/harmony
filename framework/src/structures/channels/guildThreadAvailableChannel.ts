import type { GuildThreadAvailableChannelPayload } from "../../../../types/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildThreadAvailableChannel<
  P extends GuildThreadAvailableChannelPayload,
> extends GuildChannel<P> {
  get defaultAutoArchiveDuration() {
    return this.payload.default_auto_archive_duration;
  }

  get defaultThreadRateLimitPerUser() {
    return this.payload.default_auto_archive_duration;
  }
}
