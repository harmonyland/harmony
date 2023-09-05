import type { GuildVoiceChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import type { Client } from "../../client/mod.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildVoiceBasedChannel } from "./guildVoiceBasedChannel.ts";

export class GuildVoiceChannel extends Mixin(
  GuildTextBasedChannel,
  GuildVoiceBasedChannel,
) {
  payload: GuildVoiceChannelPayload;
  constructor(client: Client, payload: GuildVoiceChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }

  get videoQualityMode() {
    return this.payload.video_quality_mode;
  }
}
