import type { GuildVoiceBasedChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildVoiceBasedChannel extends GuildChannel {
  payload: GuildVoiceBasedChannelPayload;
  constructor(client: Client, payload: GuildVoiceBasedChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }
  get bitrate() {
    return this.payload.bitrate;
  }
  get userLimit() {
    return this.payload.user_limit;
  }
  get rtcRegion() {
    return this.payload.rtc_region;
  }
}
