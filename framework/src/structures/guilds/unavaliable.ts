import type { GuildPayload } from "../../../../types/mod.ts";
import { Client } from "../../client/mod.ts";

export class UnavailableGuild {
  client: Client;
  payload: GuildPayload;

  constructor(client: Client, payload: GuildPayload) {
    this.client = client;
    this.payload = payload;
  }

  get id(): string {
    return this.payload.id;
  }
  get unavailable(): boolean | undefined {
    return this.payload.unavailable;
  }
}
