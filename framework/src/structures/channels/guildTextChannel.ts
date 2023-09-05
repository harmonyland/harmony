import type { GuildTextChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import type { Client } from "../../client/mod.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildThreadAvailableChannel } from "./guildThreadAvailableChannel.ts";

export class GuildTextChannel extends Mixin(
  GuildTextBasedChannel,
  GuildThreadAvailableChannel,
) {
  payload: GuildTextChannelPayload;
  constructor(client: Client, payload: GuildTextChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }
}
