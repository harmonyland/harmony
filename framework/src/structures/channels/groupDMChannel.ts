import type { GroupDMChannelPayload } from "../../../../types/mod.ts";
import { User } from "../users/mod.ts";
import { DMBasedChannel } from "./DMBasedChannel.ts";

export class GroupDMChannel extends DMBasedChannel<GroupDMChannelPayload> {
  get name(): string {
    return this.payload.name;
  }
  get icon(): string | null {
    return this.payload.icon;
  }
  get owner(): User | undefined {
    return this.client.users.get(this.payload.owner_id);
  }
  get applicationID(): string | undefined {
    return this.payload.application_id;
  }
  get managed(): boolean {
    return this.payload.managed;
  }
}
