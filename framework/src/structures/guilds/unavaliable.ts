import type { LightGuildPayload } from "../../../types/guild.ts";
import { Client } from "../../client/mod.ts";

export class UnavailableGuild {
  client: Client;
  payload: LightGuildPayload;

  constructor(client: Client, payload: LightGuildPayload) {
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
