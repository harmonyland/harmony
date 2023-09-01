import type { GuildStageChannelPayload } from "../../../../types/mod.ts";
import { GuildVoiceBasedChannel } from "./guildVoiceBasedChannel.ts";

export class GuildStageChannel
  extends GuildVoiceBasedChannel<GuildStageChannelPayload> {}
