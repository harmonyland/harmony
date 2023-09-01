import type { DMBasedChannelPayload } from "../../../../types/mod.ts";
import { User } from "../users/mod.ts";
import { TextChannel } from "./textChannel.ts";

export class DMBasedChannel<P extends DMBasedChannelPayload>
  extends TextChannel<P> {
  get recipients(): User[] {
    return this.payload.recipients.map((r) => new User(this.client, r));
  }
}
