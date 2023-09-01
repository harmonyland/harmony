import type { GuildVoiceChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildVoiceBasedChannel } from "./guildVoiceBasedChannel.ts";

export class GuildVoiceChannel extends Mixin(
  GuildTextBasedChannel<GuildVoiceChannelPayload>,
  GuildVoiceBasedChannel<GuildVoiceChannelPayload>,
) {
  get videoQualityMode() {
    return this.payload.video_quality_mode;
  }
}
