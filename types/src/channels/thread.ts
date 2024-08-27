import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { ComponentPayload } from "../interactions/components.ts";
import { ChannelType } from "./base.ts";
import { EmbedPayload } from "./embed.ts";
import { AllowedMentionsPayload } from "./etc.ts";
import { GuildTextChannelPayload } from "./guild.ts";
import { AttachmentPayload } from "./message.ts";

/** @link https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure */
export interface ThreadMetadataPayload {
  archive_timestamp: string;
  archived: boolean;
  auto_archive_duration: number;
  create_timestamp?: null | string;
  invitable?: boolean;
  locked: boolean;
}

/** @link https://discord.com/developers/docs/resources/channel#thread-member-object-thread-member-structure */
export interface ThreadMemberPayload {
  flags: number;
  id?: snowflake;
  join_timestamp: string;
  member?: GuildMemberPayload;
  user_id?: snowflake;
}

/** @link https://discord.com/developers/docs/resources/channel#channel-object-example-thread-channel */
export interface GuildThreadChannelPayload extends GuildTextChannelPayload {
  applied_tags?: snowflake[];
  member: ThreadMemberPayload;
  member_count: number;
  message_count: number;
  permissions: string;
  thread_metadata: ThreadMetadataPayload;
}

// https://discord.com/developers/docs/resources/channel#modify-channel-json-params-thread
export interface EditGuildThreadChannelPayload extends Reasonable {
  applied_tags?: snowflake[];
  archived?: boolean;
  /** Duration in minute */
  auto_archive_duration?: number;
  flags?: number;
  invitable?: boolean;
  locked?: boolean;
  name?: string;
  /** Duration in second */
  rate_limit_per_user?: null | number;
}

export interface StartThreadWithMessagePayload extends Reasonable {
  auto_archive_duration?: number;
  name: string;
  rate_limit_per_user?: null | number;
}

export interface StartThreadWithoutMessagePayload extends Reasonable {
  auto_archive_duration?: number;
  invitable?: boolean;
  name: string;
  rate_limit_per_user?: null | number;
  type?: ChannelType;
}

export interface ForumThreadMessageParams {
  allowed_mentions?: AllowedMentionsPayload;
  attachments?: AttachmentPayload[];
  components?: ComponentPayload[];
  content?: string;
  embeds?: EmbedPayload[];
  flags?: number;
  sticker_ids?: snowflake[];
}

export interface StartThreadInForumChannelPayload extends Reasonable {
  applied_tags?: snowflake[];
  auto_archive_duration?: number;
  message: ForumThreadMessageParams;
  name: string;
  rate_limit_per_user?: null | number;
}

export interface ListThreadsPayload {
  has_more: boolean;
  members: ThreadMemberPayload[];
  threads: GuildThreadChannelPayload[];
}

export interface ListThreadsParams {
  before?: snowflake;
  limit?: number;
}

export interface GetThreadMemberPayload {
  with_member?: boolean;
}

export interface ListThreadMembersPayload {
  after?: snowflake;
  limit?: number;
  with_member?: boolean;
}

export type ListPublicArchivedThreadsPayload = ListThreadsPayload;
export type ListPublicArchivedThreadsParams = ListThreadsParams;
export type ListPrivateArchivedThreadsPayload = ListThreadsPayload;
export type ListPrivateArchivedThreadsParams = ListThreadsParams;
export type ListJoinedPrivateArchivedThreadsPayload = ListThreadsPayload;
export type ListJoinedPrivateArchivedThreadsParams = ListThreadsParams;
