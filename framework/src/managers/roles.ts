import type { RolePayloadWithGuildID } from "../../types/role.ts";
import { Collection } from "../cache/collection.ts";
import type { Client } from "../client/mod.ts";
import { Role } from "../structures/guilds/role.ts";
import { BaseManager } from "./base.ts";

export class RolesManager extends BaseManager<RolePayloadWithGuildID, Role> {
  client: Client;
  cache: Collection<string, RolePayloadWithGuildID>;

  constructor(client: Client) {
    super(client);
    this.client = client;
    this.cache = new Collection<string, RolePayloadWithGuildID>();
  }

  _fill(payloads: RolePayloadWithGuildID[]) {
    for (const payload of payloads) {
      this.set(payload.id, payload);
    }
  }

  async _fetchAll(
    guildID: string,
  ): Promise<RolePayloadWithGuildID[] | undefined> {
    try {
      const resp: RolePayloadWithGuildID[] | undefined = await this.client.rest
        .get(
          `/guilds/${guildID}/roles`,
        );
      if (!resp) return;
      const roles = resp.map((r) => ({ ...r, guild_id: guildID }));
      this._fill(roles);
      return roles;
    } catch (_err) {
      return;
    }
  }

  async _fetch(
    guildID: string,
    id: string,
  ): Promise<RolePayloadWithGuildID | undefined> {
    try {
      const roles = await this._fetchAll(guildID);
      if (!roles) return;
      const role = roles.find((r) => r.id === id);
      if (!role) return;
      return role;
    } catch (_err) {
      return;
    }
  }

  get(
    id: string,
  ) {
    const cached = this._get(id);
    if (!cached) return;
    return new Role(this.client, cached, cached.guild_id);
  }

  async fetchAll(guildID: string): Promise<Role[] | undefined> {
    try {
      const roles = await this._fetchAll(guildID);
      if (!roles) return;
      return roles.map((r) => new Role(this.client, r, guildID));
    } catch (_err) {
      return;
    }
  }

  async fetch(
    guildID: string,
    id: string,
  ) {
    try {
      const payload = await this._fetch(guildID, id);
      if (!payload) return;
      return new Role(this.client, payload, guildID);
    } catch (_err) {
      return;
    }
  }
}
