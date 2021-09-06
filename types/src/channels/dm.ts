// deno-lint-ignore-file camelcase
import { TextChannelPayload } from "./base.ts";

// deno-lint-ignore no-empty-interface
export interface DMChannelPayload extends TextChannelPayload {
  // recipients: UserPayload[]
}

export interface GroupDMChannelPayload extends DMChannelPayload {
  name: string;
  icon: string | null;
  owner_id: string;
  application_id: string;
}
