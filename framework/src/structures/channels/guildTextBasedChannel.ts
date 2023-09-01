import { Mixin } from "../../../deps.ts";
import { TextChannel } from "./textChannel.ts";
import { GuildChannel } from "./guildChannel.ts";
import type { GuildTextBasedChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";

export class GuildTextBasedChannel<P extends GuildTextBasedChannelPayload>
  extends Mixin(
    GuildChannel,
    TextChannel,
  ) {
  constructor(client: Client, payload: P) {
    super(client, payload);
  }

  get rateLimitPerUser(): number {
    return this.payload.rate_limit_per_user;
  }

  // async bulkDelete(
  //   messages: Array<Message | string> | number
  // ): Promise<void> {
  // }
}
