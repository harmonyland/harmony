// deno-lint-ignore-file camelcase
import { TextChannelPayload } from "./base.ts";

// https://discord.com/developers/docs/resources/channel#channel-object-example-dm-channel
// deno-lint-ignore no-empty-interface
export interface DMChannelPayload extends TextChannelPayload {
  // recipients: UserPayload[]
}

// https://discord.com/developers/docs/resources/channel#channel-object-example-group-dm-channel
export interface GroupDMChannelPayload extends DMChannelPayload {
  name: string;
  icon: string | null;
  owner_id: string;
  application_id: string;
}
