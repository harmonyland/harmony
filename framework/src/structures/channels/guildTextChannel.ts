import type { GuildTextChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import type { Client } from "../../client/mod.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildThreadAvailableChannel } from "./guildThreadAvailableChannel.ts";

const GuildTextChannelSuper:
  & (abstract new (
    client: Client,
    payload: GuildTextChannelPayload,
  ) => GuildTextBasedChannel & GuildThreadAvailableChannel)
  & Pick<typeof GuildTextBasedChannel, keyof typeof GuildTextBasedChannel>
  & Pick<
    typeof GuildThreadAvailableChannel,
    keyof typeof GuildThreadAvailableChannel
  > = Mixin(
    GuildTextBasedChannel,
    GuildThreadAvailableChannel,
  );

export class GuildTextChannel extends GuildTextChannelSuper {
  payload: GuildTextChannelPayload;
  constructor(client: Client, payload: GuildTextChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }
}
