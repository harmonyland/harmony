import type { EmojiPayload } from "../../../types/mod.ts";
import type { EmojiPayloadWithGuildID } from "../../types/emoji.ts";
import type { Client } from "../client/mod.ts";
import { Emoji } from "../structures/emojis/mod.ts";
import { BaseChildManager } from "./baseChild.ts";
import type { EmojisManager } from "./emojis.ts";

export class GuildEmojisManager
  extends BaseChildManager<EmojiPayloadWithGuildID, Emoji> {
  guildID: string;

  constructor(client: Client, parent: EmojisManager, guildID: string) {
    super(client, parent);
    this.guildID = guildID;
  }

  _fill(payloads: EmojiPayload[]) {
    for (const payload of payloads) {
      this.set(payload.id!, {
        ...payload,
        guild_id: this.guildID,
      });
    }
  }

  _get(key: string): EmojiPayloadWithGuildID | undefined {
    const emoji = this.parent._get(key);
    if (!emoji) return;
    if (emoji.guild_id !== this.guildID) return;
    return emoji;
  }

  async _fetchAll(): Promise<EmojiPayloadWithGuildID[] | undefined> {
    try {
      const resp: EmojiPayload[] | undefined = await this.client.rest
        .get(
          `/guilds/${this.guildID}/emojis`,
        );
      if (!resp) return;
      const emojis = resp.map((r) => ({ ...r, guild_id: this.guildID }));
      this._fill(emojis);
      return emojis;
    } catch (_err) {
      return;
    }
  }

  async _fetch(id: string): Promise<EmojiPayloadWithGuildID | undefined> {
    try {
      const resp: EmojiPayload | undefined = await this.client.rest
        .get(
          `/guilds/${this.guildID}/emojis/${id}`,
        );
      if (!resp) return;
      const emoji = {
        ...resp,
        guild_id: this.guildID,
      };
      this.set(id, emoji);
      return emoji;
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

  async fetchAll(): Promise<Emoji[] | undefined> {
    try {
      const emojis = await this._fetchAll();
      if (!emojis) return;
      return emojis.map((r) => new Emoji(this.client, r, this.guildID));
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
      return new Emoji(this.client, payload, this.guildID);
    } catch (_err) {
      return;
    }
  }
}
