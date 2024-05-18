import type { GuildAnnouncementChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import type { Client } from "../../client/mod.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildThreadAvailableChannel } from "./guildThreadAvailableChannel.ts";

const GuildAnnouncementChannelSuper:
  & (abstract new (
    client: Client,
    payload: GuildAnnouncementChannelPayload,
  ) => GuildTextBasedChannel & GuildThreadAvailableChannel)
  & Pick<typeof GuildTextBasedChannel, keyof typeof GuildTextBasedChannel>
  & Pick<
    typeof GuildThreadAvailableChannel,
    keyof typeof GuildThreadAvailableChannel
  > = Mixin(
    GuildTextBasedChannel,
    GuildThreadAvailableChannel,
  );

export class GuildAnnouncementChannel extends GuildAnnouncementChannelSuper {
  payload: GuildAnnouncementChannelPayload;
  constructor(
    client: Client,
    payload: GuildAnnouncementChannelPayload,
  ) {
    super(client, payload);
    this.payload = payload;
  }
}
