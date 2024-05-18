import type { GuildVoiceChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import type { Client } from "../../client/mod.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildVoiceBasedChannel } from "./guildVoiceBasedChannel.ts";

const GuildGuildVoiceChannelSuper:
  & (abstract new (
    client: Client,
    payload: GuildVoiceChannelPayload,
  ) => GuildTextBasedChannel & GuildVoiceBasedChannel)
  & Pick<typeof GuildTextBasedChannel, keyof typeof GuildTextBasedChannel>
  & Pick<typeof GuildVoiceBasedChannel, keyof typeof GuildVoiceBasedChannel> =
    Mixin(
      GuildTextBasedChannel,
      GuildVoiceBasedChannel,
    );

export class GuildVoiceChannel extends GuildGuildVoiceChannelSuper {
  payload: GuildVoiceChannelPayload;
  constructor(client: Client, payload: GuildVoiceChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }

  get videoQualityMode() {
    return this.payload.video_quality_mode;
  }
}
