import { Reasonable } from "../etc/reasonable.ts";
import { ChannelType } from "./base.ts";
import { GuildTextChannelPayload } from "./guild.ts";

// https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure
export interface ThreadMetadataPayload {
  archived: boolean;
  auto_archive_duration: number;
  archive_timestamp: string;
  locked: boolean;
  invitable?: boolean;
}

// https://discord.com/developers/docs/resources/channel#thread-member-object-thread-member-structure
export interface ThreadMemberPayload {
  id?: string;
  user_id?: string;
  join_timestamp: string;
  flags: number;
}

// https://discord.com/developers/docs/resources/channel#channel-object-example-thread-channel
export interface GuildThreadChannelPayload extends GuildTextChannelPayload {
  message_count: number;
  member_count: number;
  thread_metadata: ThreadMetadataPayload;
  member: ThreadMemberPayload;
  default_auto_archive_duration: number;
  permissions: string;
}

// https://discord.com/developers/docs/resources/channel#modify-channel-json-params-thread
export interface EditGuildThreadCHannelPayload extends Reasonable {
  name?: string;
  archived?: boolean;
  /** Duration in minute */
  auto_archive_duration?: number;
  locked?: boolean;
  invitable?: boolean;
  /** Duration in second */
  rate_limit_per_user?: number | null;
}

export interface StartThreadWithMessagePayload {
  name: string;
  auto_archive_duration?: number;
  reason?: string;
}

export interface StartThreadWithoutMessagePayload {
  name: string;
  auto_archive_duration?: number;
  type?: ChannelType;
  invitable?: boolean;
  reason?: string;
}

export interface ListThreadsPayload {
  threads: GuildThreadChannelPayload[];
  members: ThreadMemberPayload[];
  has_more: boolean;
}

export interface ListThreadsParams {
  before?: string;
  limit?: number;
}
