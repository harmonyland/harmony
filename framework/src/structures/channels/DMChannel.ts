import type { DMChannelPayload } from "../../../../types/mod.ts";
import { DMBasedChannel } from "./DMBasedChannel.ts";

export class DMChannel extends DMBasedChannel<DMChannelPayload> {
  get recipient() {
    return this.payload.recipients[0];
  }
}
