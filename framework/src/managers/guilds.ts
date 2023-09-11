import type { GuildPayload } from "../../../types/mod.ts";
import type { LightGuildPayload } from "../../types/guild.ts";
import { Collection } from "../cache/collection.ts";
import type { Client } from "../client/mod.ts";
import { Guild } from "../structures/guilds/guild.ts";
import { BaseManager } from "./base.ts";

export class GuildsManager extends BaseManager<LightGuildPayload, Guild> {
  client: Client;
  cache: Collection<string, LightGuildPayload>;

  constructor(client: Client) {
    super(client);
    this.client = client;
    this.cache = new Collection<string, LightGuildPayload>();
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

  set(key: string, value: LightGuildPayload): void {
    // TODO: remove more duplication
    const lightGuild: LightGuildPayload = {
      ...value,
      channels: undefined,
      roles: undefined,
      emojis: undefined,
    };
    this.cache.set(key, lightGuild);
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
