import type { GuildAnnouncementChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import type { Client } from "../../client/mod.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildThreadAvailableChannel } from "./guildThreadAvailableChannel.ts";

export class GuildAnnouncementChannel extends Mixin(
  GuildTextBasedChannel,
  GuildThreadAvailableChannel,
) {
  payload: GuildAnnouncementChannelPayload;
  constructor(
    client: Client,
    payload: GuildAnnouncementChannelPayload,
  ) {
    super(client, payload);
    this.payload = payload;
  }
}
