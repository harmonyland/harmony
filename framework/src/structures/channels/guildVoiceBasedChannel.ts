import type { GuildVoiceBasedChannelPayload } from "../../../../types/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildVoiceBasedChannel<P extends GuildVoiceBasedChannelPayload>
  extends GuildChannel<P> {
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
