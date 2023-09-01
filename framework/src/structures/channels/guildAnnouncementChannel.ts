import type { GuildAnnouncementChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildThreadAvailableChannel } from "./guildThreadAvailableChannel.ts";

export class GuildAnnouncementChannel extends Mixin(
  GuildTextBasedChannel<GuildAnnouncementChannelPayload>,
  GuildThreadAvailableChannel<GuildAnnouncementChannelPayload>,
) {
}
