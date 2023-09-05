import type { DMChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { DMBasedChannel } from "./DMBasedChannel.ts";

export class DMChannel extends DMBasedChannel {
  payload: DMChannelPayload;
  constructor(client: Client, payload: DMChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }

  get recipient() {
    return this.payload.recipients[0];
  }
}
