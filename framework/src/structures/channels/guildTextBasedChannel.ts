import { Mixin } from "../../../deps.ts";
import type { Client } from "../../client/mod.ts";
import { TextChannel } from "./textChannel.ts";
import { GuildChannel } from "./guildChannel.ts";
import type { GuildTextBasedChannelPayload } from "../../../../types/mod.ts";
import type { Message } from "../messages/message.ts";

export class GuildTextBasedChannel extends Mixin(GuildChannel, TextChannel) {
  constructor(client: Client, payload: GuildTextBasedChannelPayload) {
    super(client, payload);
  }

  // async bulkDelete(
  //   messages: Array<Message | string> | number
  // ): Promise<void> {
  // }
}
