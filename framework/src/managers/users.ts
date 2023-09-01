import type { UserPayload } from "../../../types/mod.ts";
import { Collection } from "../cache/collection.ts";
import type { Client } from "../client/mod.ts";
import { User } from "../structures/users/mod.ts";
import { BaseManager } from "./base.ts";

export class UsersManager extends BaseManager<UserPayload, User> {
  client: Client;
  cache: Collection<string, UserPayload>;

  constructor(client: Client) {
    super(client);
    this.client = client;
    this.cache = new Collection<string, UserPayload>();
  }

  async _fetch(id: string): Promise<UserPayload | undefined> {
    try {
      const resp: UserPayload | undefined = await this.client.rest.get(
        `/users/${id}`,
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
    return new User(this.client, cached);
  }
  async fetch(
    id: string,
  ) {
    try {
      const payload = await this._fetch(id);
      if (!payload) return;
      return new User(this.client, payload);
    } catch (_err) {
      return;
    }
  }
}
