import type { GuildThreadAvailableChannelPayload } from "../../../../types/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildThreadAvailableChannel<
  P extends GuildThreadAvailableChannelPayload,
> extends GuildChannel<P> {
}
