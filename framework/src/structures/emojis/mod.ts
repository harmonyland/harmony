import { EmojiPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { User } from "../users/mod.ts";

export class Emoji {
  client: Client;
  payload: EmojiPayload;
  guildID?: string;

  constructor(client: Client, payload: EmojiPayload, guildID?: string) {
    this.client = client;
    this.payload = payload;
    this.guildID = guildID;
  }

  get id() {
    return this.payload.id;
  }
  get name() {
    return this.payload.name;
  }
  get roles() {
    return this.payload.roles?.map((id) => this.client.roles.get(id));
  }
  get user() {
    return this.payload.user !== undefined
      ? new User(this.client, this.payload.user)
      : undefined;
  }
  get requireColons() {
    return this.payload.require_colons;
  }
  get managed() {
    return this.payload.managed;
  }
  get animated() {
    return this.payload.animated;
  }
  get available() {
    return this.payload.available;
  }
}
