import { ChannelPayload } from "../../../mod.ts";
import { Client } from "../client/mod.ts";
import { Channel } from "../structures/channels/channel.ts";
import { BaseManager } from "./base.ts";

export class ChannelsManager implements BaseManager<ChannelPayload, Channel> {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  _get(id: string): ChannelPayload | undefined {
    return this.client.cache.get(`channel:${id}`);
  }

  async get(id: string): Promise<Channel | undefined> { // TODO: make a better way to convert payload to other structures
    const cached = this._get(id);
    if (!cached) return await this.fetch(id);
    return new Channel(this.client, cached);
  }
  async fetch(id: string): Promise<Channel | undefined> {
    try {
      const resp: ChannelPayload | undefined = await this.client.rest.get(
        `/channels/${id}`,
      );
      if (!resp) return;
      this.set(id, resp);
      const channel = new Channel(this.client, resp);
      return channel;
    } catch (_err) {
      return;
    }
  }

  set(id: string, channel: ChannelPayload): void {
    this.client.cache.set(`channel:${id}`, channel);
  }

  delete(id: string): boolean {
    return this.client.cache.delete(`channel:${id}`);
  }
}
