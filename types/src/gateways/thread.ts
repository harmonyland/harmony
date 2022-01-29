import {
  GuildThreadChannelPayload,
  ThreadMemberPayload,
} from "../channels/thread.ts";

export interface GatewayThreadListSyncPayload {
  guild_id: string;
  channel_ids?: string[];
  threads: GuildThreadChannelPayload[];
  members: ThreadMemberPayload[];
}

export interface GatewayThreadMemberUpdatePayload extends ThreadMemberPayload {
  guild_id: string;
}

export interface GatewayThreadMembersUpdatePayload {
  id: string;
  guild_id: string;
  member_count: number;
  added_members?: ThreadMemberPayload[];
  removed_member_ids?: string[];
}

export interface GatewayScheduledEventUserAddPayload {
  guild_scheduled_event_id: string;
  user_id: string;
  guild_id: string;
}

export type GatewayScheduledEventUserRemovePayload =
  GatewayScheduledEventUserAddPayload;
