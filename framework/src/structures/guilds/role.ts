import { RolePayload } from "../../../../types/mod.ts";
import { Client } from "../../client/mod.ts";

export class Role {
  client: Client;
  payload: RolePayload;
  guildID: string;

  constructor(client: Client, payload: RolePayload, guildID: string) {
    this.client = client;
    this.payload = payload;
    this.guildID = guildID;
  }

  get id(): string {
    return this.payload.id;
  }
}
