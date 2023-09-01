import type { GuildTextChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildThreadAvailableChannel } from "./guildThreadAvailableChannel.ts";

export class GuildTextChannel extends Mixin(
  GuildTextBasedChannel<GuildTextChannelPayload>,
  GuildThreadAvailableChannel<GuildTextChannelPayload>,
) {
}
