import type { DMBasedChannelPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { User } from "../users/mod.ts";
import { TextChannel } from "./textChannel.ts";

export class DMBasedChannel extends TextChannel {
  payload: DMBasedChannelPayload;
  constructor(client: Client, payload: DMBasedChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }

  get recipients(): User[] {
    return this.payload.recipients.map((r) => new User(this.client, r));
  }
}
