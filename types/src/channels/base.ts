import { InviteTargetType } from "../invites/intive.ts";

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
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object */
export interface ChannelPayload {
  id: string;
  type: ChannelType;
  flags: number;
}

export interface TextChannelPayload extends ChannelPayload {
  last_pin_timestamp: string | null;
  last_message_id: string | null;
}

export interface CreateChannelInvitePayload {
  max_age?: number;
  max_uses?: number;
  temporary?: boolean;
  unique?: boolean;
  target_type?: InviteTargetType;
  target_user_id?: string;
  target_applicaton_id?: string;
}
