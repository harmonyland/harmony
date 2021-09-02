import { TextChannelPayload } from "./base.ts";

export interface DMChannelPayload extends TextChannelPayload {
  // recipients: User[]
}

export interface GroupDMChannelPayload extends DMChannelPayload {
  name: string;
  icon: string | null;
  owner_id: string;
  application_id: string;
}
