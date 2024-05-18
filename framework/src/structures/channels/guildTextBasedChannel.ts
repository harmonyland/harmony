import { Mixin } from "../../../deps.ts";
import { TextChannel } from "./textChannel.ts";
import { GuildChannel } from "./guildChannel.ts";
import type { GuildTextBasedChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";

const GuildTextBasedChannelSuper:
  & (abstract new (
    client: Client,
    payload: GuildTextBasedChannelPayload,
  ) => TextChannel & GuildChannel)
  & Pick<typeof TextChannel, keyof typeof TextChannel>
  & Pick<typeof GuildChannel, keyof typeof GuildChannel> = Mixin(
    TextChannel,
    GuildChannel,
  );

export class GuildTextBasedChannel extends GuildTextBasedChannelSuper {
  payload: GuildTextBasedChannelPayload;
  constructor(client: Client, payload: GuildTextBasedChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }

  get rateLimitPerUser(): number {
    return this.payload.rate_limit_per_user;
  }

  // async bulkDelete(
  //   messages: Array<Message | string> | number
  // ): Promise<void> {
  // }
}
