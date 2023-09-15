import type { EveryChannels } from "../../types/channel.ts";
import type { Guild } from "../structures/guilds/guild.ts";
import type { Message } from "../structures/mod.ts";

// ...this is gonna be very painful to fix
export type ClientEvents = {
  messageCreate: [message: Message];
  ready: [];
  guildCreate: [guild: Guild];
  channelCreate: [channel: EveryChannels];
  channelDelete: [channel: EveryChannels];
};
