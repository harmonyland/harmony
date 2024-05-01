import {
  GuildThreadChannelPayload,
  ThreadMemberPayload,
} from "../channels/thread.ts";
import { snowflake } from "../common.ts";

export interface GatewayThreadListSyncPayload {
  guild_id: snowflake;
  channel_ids?: snowflake[];
  threads: GuildThreadChannelPayload[];
  members: ThreadMemberPayload[];
}

export interface GatewayThreadMemberUpdatePayload extends ThreadMemberPayload {
  guild_id: snowflake;
}

export interface GatewayThreadMembersUpdatePayload {
  id: snowflake;
  guild_id: snowflake;
  member_count: number;
  added_members?: ThreadMemberPayload[];
  removed_member_ids?: snowflake[];
}

export interface GatewayScheduledEventUserAddPayload {
  guild_scheduled_event_id: snowflake;
  user_id: snowflake;
  guild_id: snowflake;
}

export type GatewayScheduledEventUserRemovePayload =
  GatewayScheduledEventUserAddPayload;
