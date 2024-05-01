import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";
import { ChannelType, TextChannelPayload } from "./base.ts";

export interface DMBasedChannelPayload extends TextChannelPayload {
  recipients: UserPayload[];
}

// https://discord.com/developers/docs/resources/channel#channel-object-example-dm-channel
export interface DMChannelPayload extends DMBasedChannelPayload {
  type: ChannelType.DM;
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-group-dm-channel */
export interface GroupDMChannelPayload extends DMBasedChannelPayload {
  type: ChannelType.GROUP_DM;
  name: string;
  icon: string | null;
  owner_id: snowflake;
  application_id?: snowflake;
  managed: boolean;
}

/** @link https://discord.com/developers/docs/resources/channel#modify-channel-json-params-group-dm */
export interface EditGroupDMChannelPayload extends Reasonable {
  name?: string;
  icon?: string;
}

export interface GroupDMAddRecipientPayload {
  access_token: string;
  nick?: string;
}
