import {
  ChannelType,
  type GuildChannelPayload,
  type GuildTextChannelPayload,
} from "../../../types/mod.ts";
import type { Client } from "../client/mod.ts";
import { GuildChannel } from "../structures/channels/guildChannel.ts";
import { GuildTextChannel } from "../structures/channels/guildTextChannel.ts";
import { BaseManager } from "./base.ts";
import { BaseChildManager } from "./baseChild.ts";
import type { ChannelsManager } from "./channels.ts";

export class GuildChannelsManager
  extends BaseChildManager<GuildChannelPayload, GuildChannel> {
  guildID: string;

  constructor(client: Client, parent: ChannelsManager, guildID: string) {
    super(
      client,
      parent as unknown as BaseManager<GuildChannelPayload, GuildChannel>,
    );
    this.guildID = guildID;
  }

  private _createChannel<P extends GuildChannelPayload>(payload: P) {
    switch (payload.type) {
      case ChannelType.GUILD_TEXT:
        return new GuildTextChannel(
          this.client,
          payload as unknown as GuildTextChannelPayload,
        );
      default:
        return new GuildChannel(this.client, payload);
    }
  }

  _fill(payloads: GuildChannelPayload[]) {
    for (const payload of payloads) {
      this.set(payload.id!, payload);
    }
  }

  _get(key: string): GuildChannelPayload | undefined {
    const channel = this.parent._get(key);
    if (!channel) return;
    if (channel.guild_id !== this.guildID) return;
    return channel;
  }

  async _fetchAll(): Promise<GuildChannelPayload[] | undefined> {
    try {
      const resp: GuildChannelPayload[] | undefined = await this.client.rest
        .get(
          `/guilds/${this.guildID}/channels`,
        );
      if (!resp) return;
      const channels = resp;
      this._fill(channels);
      return channels;
    } catch (_err) {
      return;
    }
  }

  async _fetch(id: string): Promise<GuildChannelPayload | undefined> {
    try {
      const resp: GuildChannelPayload | undefined = await this.client.rest
        .get(
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
    return this._createChannel(cached);
  }

  async fetchAll() {
    try {
      const channels = await this._fetchAll();
      if (!channels) return;
      return channels.map((r) => this._createChannel(r));
    } catch (_err) {
      return;
    }
  }

  async fetch(
    id: string,
  ) {
    try {
      const payload = await this._fetch(id);
      if (!payload) return;
      return this._createChannel(payload);
    } catch (_err) {
      return;
    }
  }
}
