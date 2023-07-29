import type { ChannelPayload, ChannelType } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";

export class Channel<T extends ChannelPayload> {
  client: Client;
  payload: T;

  constructor(client: Client, payload: T) {
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
