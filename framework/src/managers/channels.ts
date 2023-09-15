import { type ChannelPayload } from "../../../types/mod.ts";
import { Channel } from "../structures/channels/channel.ts";
import { createChannel } from "../utils/channel.ts";
import { BaseManager } from "./base.ts";

export class ChannelsManager extends BaseManager<ChannelPayload, Channel> {
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
    return createChannel(this.client, cached);
  }
  async fetch<P extends ChannelPayload>(
    id: string,
  ) {
    try {
      const payload = await this._fetch<P>(id);
      if (!payload) return;
      return createChannel(this.client, payload);
    } catch (_err) {
      return;
    }
  }
}
