import type { EmojiPayload } from "../../../types/mod.ts";
import type { EmojiPayloadWithGuildID } from "../../types/emoji.ts";
import { Emoji } from "../structures/emojis/mod.ts";
import { BaseManager } from "./base.ts";

export class EmojisManager extends BaseManager<EmojiPayloadWithGuildID, Emoji> {
  _fill(emojis: EmojiPayloadWithGuildID[]) {
    for (const emoji of emojis) {
      this.set(emoji.id!, emoji);
    }
  }

  async _fetch(
    guildID: string,
    id: string,
  ): Promise<EmojiPayloadWithGuildID | undefined> {
    try {
      const resp: EmojiPayload | undefined = await this.client.rest.get(
        `/guilds/${guildID}/emojis/${id}`,
      );
      if (!resp) return;
      const result = {
        ...resp,
        guild_id: guildID,
      };
      this.set(id, result);
      return result;
    } catch (_err) {
      return;
    }
  }
  async _fetchAll(
    guildID: string,
  ): Promise<EmojiPayloadWithGuildID[] | undefined> {
    try {
      const resp: EmojiPayload[] | undefined = await this.client.rest.get(
        `/guilds/${guildID}/emojis`,
      );
      if (!resp) return;
      return resp.map((emoji) => {
        const withGuildID = {
          ...emoji,
          guild_id: guildID,
        };
        this.set(emoji.id!, withGuildID);
        return withGuildID;
      });
    } catch (_err) {
      return;
    }
  }

  get(
    id: string,
  ) {
    const cached = this._get(id);
    if (!cached) return;
    return new Emoji(this.client, cached, cached.guild_id);
  }
  async fetch(
    guildID: string,
    id: string,
  ) {
    try {
      const payload = await this._fetch(guildID, id);
      if (!payload) return;
      return new Emoji(this.client, payload, payload.guild_id);
    } catch (_err) {
      return;
    }
  }
}
