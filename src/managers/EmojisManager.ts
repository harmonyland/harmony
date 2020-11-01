import { Client } from "../models/client.ts";
import { Emoji } from "../structures/emoji.ts";
import { EmojiPayload } from "../types/emoji.ts";
import { CHANNEL } from "../types/endpoint.ts";
import { BaseManager } from "./BaseManager.ts";

export class EmojisManager extends BaseManager<EmojiPayload, Emoji> {
  constructor(client: Client) {
    super(client, "emojis", Emoji)
  }

  fetch(id: string) {
    return new Promise((res, rej) => {
      this.client.rest.get(CHANNEL(id)).then(data => {
        this.set(id, data as EmojiPayload)
        res(new Emoji(this.client, data as EmojiPayload))
      }).catch(e => rej(e))
    })
  }
}