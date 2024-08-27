import type { GuildMemberPayload } from "../../../types/mod.ts";
import { Collection } from "../cache/mod.ts";
import type { Client } from "../client/mod.ts";
import { BaseManager } from "./base.ts";
import { GuildMembersManager } from "./guildMembers.ts";

export class MembersManager extends BaseManager<
  Collection<string, GuildMemberPayload>,
  GuildMembersManager
> {
  constructor(client: Client) {
    super(client);
  }

  _fill(guildID: string, payloads: GuildMemberPayload[]) {
    if (!this.has(guildID)) {
      this.set(guildID, new Collection());
    }
    for (const payload of payloads) {
      if (payload.user === undefined) continue;
      this.get(guildID)!.set(payload.user.id, payload);
    }
  }

  async _fetch(
    guildID: string,
    options?: {
      limit?: number;
      after?: string;
    },
  ): Promise<Collection<string, GuildMemberPayload> | undefined> {
    try {
      const resp: GuildMemberPayload[] | undefined = await this.client.rest.get(
        `/guilds/${guildID}/members`,
        {
          query: options
            ? { limit: options.limit?.toString(), after: options.after }
            : {},
        },
      );
      if (!resp) return;
      this._fill(guildID, resp);
      return this._get(guildID)!;
    } catch (_err) {
      return;
    }
  }

  get(
    id: string,
  ) {
    if (!this.has(id)) {
      this.set(id, new Collection());
    }
    const cached = this._get(id)!;
    return new GuildMembersManager(this.client, id, cached);
  }

  async fetch(
    guildID: string,
    options?: {
      limit?: number;
      after?: string;
    },
  ) {
    try {
      const collection = await this._fetch(guildID, options);
      if (!collection) return;
      return new GuildMembersManager(this.client, guildID, collection);
    } catch (_err) {
      return;
    }
  }
}
