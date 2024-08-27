import {
  GuildThreadChannelPayload,
  ThreadMemberPayload,
} from "../channels/thread.ts";
import { snowflake } from "../common.ts";

export interface GatewayThreadListSyncPayload {
  channel_ids?: snowflake[];
  guild_id: snowflake;
  members: ThreadMemberPayload[];
  threads: GuildThreadChannelPayload[];
}

export interface GatewayThreadMemberUpdatePayload extends ThreadMemberPayload {
  guild_id: snowflake;
}

export interface GatewayThreadMembersUpdatePayload {
  added_members?: ThreadMemberPayload[];
  guild_id: snowflake;
  id: snowflake;
  member_count: number;
  removed_member_ids?: snowflake[];
}

export interface GatewayScheduledEventUserAddPayload {
  guild_id: snowflake;
  guild_scheduled_event_id: snowflake;
  user_id: snowflake;
}

export type GatewayScheduledEventUserRemovePayload =
  GatewayScheduledEventUserAddPayload;
