import type { RolePayload } from "../../../types/mod.ts";
import type { RolePayloadWithGuildID } from "../../types/role.ts";
import type { Client } from "../client/mod.ts";
import { Role } from "../structures/guilds/role.ts";
import { BaseChildManager } from "./baseChild.ts";
import type { RolesManager } from "./roles.ts";

export class GuildRolesManager
  extends BaseChildManager<RolePayloadWithGuildID, Role> {
  guildID: string;

  constructor(client: Client, parent: RolesManager, guildID: string) {
    super(client, parent);
    this.guildID = guildID;
  }

  _fill(payloads: RolePayload[]) {
    for (const payload of payloads) {
      this.set(payload.id, {
        ...payload,
        guild_id: this.guildID,
      });
    }
  }

  _get(key: string): RolePayloadWithGuildID | undefined {
    const role = this.parent._get(key);
    if (!role) return;
    if (role.guild_id !== this.guildID) return;
    return role;
  }

  async _fetchAll(): Promise<RolePayloadWithGuildID[] | undefined> {
    try {
      const resp: RolePayloadWithGuildID[] | undefined = await this.client.rest
        .get(
          `/guilds/${this.guildID}/roles`,
        );
      if (!resp) return;
      const roles = resp.map((r) => ({ ...r, guild_id: this.guildID }));
      this._fill(roles);
      return roles;
    } catch (_err) {
      return;
    }
  }

  async _fetch(id: string): Promise<RolePayloadWithGuildID | undefined> {
    try {
      const roles = await this._fetchAll();
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

  async fetchAll(): Promise<Role[] | undefined> {
    try {
      const roles = await this._fetchAll();
      if (!roles) return;
      return roles.map((r) => new Role(this.client, r, this.guildID));
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
      return new Role(this.client, payload, this.guildID);
    } catch (_err) {
      return;
    }
  }
}
