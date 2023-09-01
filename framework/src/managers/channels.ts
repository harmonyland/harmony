import {
  type ChannelPayload,
  ChannelType,
  type GuildTextChannelPayload,
} from "../../../types/mod.ts";
import { Channel } from "../structures/channels/channel.ts";
import { GuildTextChannel } from "../structures/channels/guildTextChannel.ts";
import { BaseManager } from "./base.ts";

export class ChannelsManager
  extends BaseManager<ChannelPayload, Channel<ChannelPayload>> {
  private createChannel<P extends ChannelPayload>(payload: P) {
    switch (payload.type) {
      case ChannelType.GUILD_TEXT:
        return new GuildTextChannel(
          this.client,
          payload as unknown as GuildTextChannelPayload,
        );
      default:
        return new Channel(this.client, payload);
    }
  }

  _get<P extends ChannelPayload>(id: string): P | undefined {
    return this.cache.get(id) as P | undefined;
  }

  async _fetch<P extends ChannelPayload>(id: string): Promise<P | undefined> {
    try {
      const resp: P | undefined = await this.client.rest.get(
        `/channels/${id}`,
      );
      if (!resp) return;
      this.set(id, resp);
      return resp;
    } catch (_err) {
      return;
    }
  }

  get(
    id: string,
  ) {
    const cached = this._get(id);
    if (!cached) return;
    return this.createChannel(cached);
  }
  async fetch<P extends ChannelPayload>(
    id: string,
  ) {
    try {
      const payload = await this._fetch<P>(id);
      if (!payload) return;
      return this.createChannel(payload);
    } catch (_err) {
      return;
    }
  }
}
