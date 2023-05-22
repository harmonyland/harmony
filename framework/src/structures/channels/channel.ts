import type { ChannelPayload, ChannelType } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";

export class Channel {
  client: Client;
  id: string;
  type: ChannelType;
  flags: number;

  constructor(client: Client, payload: ChannelPayload) {
    this.client = client;
    this.id = payload.id;
    this.type = payload.type;
    this.flags = payload.flags;
  }
}
