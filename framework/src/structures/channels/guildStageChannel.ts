import type { GuildStageChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { GuildVoiceBasedChannel } from "./guildVoiceBasedChannel.ts";

export class GuildStageChannel extends GuildVoiceBasedChannel {
  payload: GuildStageChannelPayload;
  constructor(client: Client, payload: GuildStageChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }
}
