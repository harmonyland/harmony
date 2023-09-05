import type { ChannelPayload, ChannelType } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";

export class Channel {
  client: Client;
  payload: ChannelPayload;

  constructor(client: Client, payload: ChannelPayload) {
    this.client = client;
    this.payload = payload;
  }

  get id(): string {
    return this.payload.id;
  }

  get type(): ChannelType {
    return this.payload.type;
  }

  get flags(): number {
    return this.payload.flags;
  }
}
