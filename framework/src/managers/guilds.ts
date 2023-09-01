import type { GuildPayload } from "../../../types/mod.ts";
import { Collection } from "../cache/collection.ts";
import type { Client } from "../client/mod.ts";
import { Guild } from "../structures/guilds/guild.ts";
import { BaseManager } from "./base.ts";

export class GuildsManager extends BaseManager<GuildPayload, Guild> {
  client: Client;
  cache: Collection<string, GuildPayload>;

  constructor(client: Client) {
    super(client);
    this.client = client;
    this.cache = new Collection<string, GuildPayload>();
  }

  async _fetch(id: string): Promise<GuildPayload | undefined> {
    try {
      const resp: GuildPayload | undefined = await this.client.rest.get(
        `/guilds/${id}`,
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
    return new Guild(this.client, cached);
  }
  async fetch(
    id: string,
  ) {
    try {
      const payload = await this._fetch(id);
      if (!payload) return;
      return new Guild(this.client, payload);
    } catch (_err) {
      return;
    }
  }
}
