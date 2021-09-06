// deno-lint-ignore-file camelcase
import { GuildTextChannelPayload } from "./guild.ts";

export interface ThreadMetadataPayload {
  archived: boolean;
  auto_archive_duration: number;
  archive_timestamp: string;
  locked: boolean;
  invitable?: boolean;
}

export interface ThreadMemberPayload {
  id?: string;
  user_id?: string;
  join_timestamp: string;
  flags: number;
}

export interface GuildThreadChannelPayload extends GuildTextChannelPayload {
  message_count: number;
  member_count: number;
  thread_metadata: ThreadMetadataPayload;
}
