import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";
import { TextChannelPayload } from "./base.ts";

// https://discord.com/developers/docs/resources/channel#channel-object-example-dm-channel
export interface DMChannelPayload extends TextChannelPayload {
  recipients: UserPayload[];
}

// https://discord.com/developers/docs/resources/channel#channel-object-example-group-dm-channel
export interface GroupDMChannelPayload extends DMChannelPayload {
  name: string;
  icon: string | null;
  owner_id: string;
  application_id: string;
}

// https://discord.com/developers/docs/resources/channel#modify-channel-json-params-group-dm
export interface EditGroupDMChannelPayload extends Reasonable {
  name?: string;
  icon?: string;
}
