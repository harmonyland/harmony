import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { InviteTargetType } from "../invites/invite.ts";

// https://discord.com/developers/docs/resources/channel#channel-object-channel-types
export enum ChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_ANNOUNCEMENT = 5,
  ANNOUNCEMENT_THREAD = 10,
  GUILD_PUBLIC_THREAD = 11,
  GUILD_PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
  GUILD_DIRECTORY = 14,
  GUILD_FORUM = 15,
  GUILD_MEDIA = 16,
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object */
export interface ChannelPayload {
  id: snowflake;
  type: ChannelType;
  flags?: number;
}

export enum ChannelFlags {
  PINNED = 1 << 1,
  REQUIRE_TAG = 1 << 4,
  HIDE_MEDIA_DOWNLOAD_OPTIONS = 1 << 15,
}

export interface TextChannelPayload extends ChannelPayload {
  last_pin_timestamp: string | null;
  last_message_id: snowflake | null;
}

export interface CreateChannelInvitePayload extends Reasonable {
  max_age?: number;
  max_uses?: number;
  temporary?: boolean;
  unique?: boolean;
  target_type?: InviteTargetType;
  target_user_id?: snowflake;
  target_applicaton_id?: snowflake;
}
