import type { GuildMemberPayload } from "../../../types/mod.ts";
import type { Collection } from "../cache/mod.ts";
import type { Client } from "../client/mod.ts";
import { Member } from "../structures/guilds/member.ts";
import { BaseManager } from "./base.ts";

export class GuildMembersManager
  extends BaseManager<GuildMemberPayload, Member> {
  guildID: string;

  constructor(
    client: Client,
    guildID: string,
    cache: Collection<string, GuildMemberPayload>,
  ) {
    super(client);
    this.guildID = guildID;
    this.cache = cache;
  }

  get(id: string) {
    const cached = this._get(id);
    if (!cached) return;
    return new Member(this.client, cached);
  }

  async fetch(id: string) {
    try {
      const payload = await this._fetch(id);
      if (!payload) return;
      return new Member(this.client, payload);
    } catch (_err) {
      return;
    }
  }

  async _fetch(
    id: string,
  ): Promise<GuildMemberPayload | undefined> {
    try {
      const resp: GuildMemberPayload | undefined = await this.client.rest.get(
        `/guilds/${this.guildID}/members/${id}`,
      );
      if (!resp) return;
      this.set(id, resp);
      return resp;
    } catch (_err) {
      return;
    }
  }
}
