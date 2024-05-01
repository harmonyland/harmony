import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { UserPayload } from "../users/user.ts";

export interface ScheduledEventPayload {
  id: snowflake;
  guild_id: snowflake;
  channel_id: snowflake | null;
  creator_id?: snowflake | null;
  name: string;
  description?: string;
  scheduled_start_time: string;
  scheduled_end_time: string | null;
  privacy_level: ScheduledEventPrivacyLevel;
  status: ScheduledEventStatus;
  entity_type: ScheduledEventEntityType;
  entity_id: snowflake | null;
  entity_metadata: ScheduledEventEntityMetadataPayload;
  creator?: UserPayload;
  user_cound?: number;
  image?: string | null;
}

export enum ScheduledEventPrivacyLevel {
  GUILD_ONLY = 2,
}

export enum ScheduledEventStatus {
  SCHEDULED = 1,
  ACTIVE = 2,
  COMPLETED = 3,
  CANCELED = 4,
}

export enum ScheduledEventEntityType {
  STAGE_INSTANCE = 1,
  VOICE = 2,
  EXTERNAL = 3,
}

export interface ScheduledEventEntityMetadataPayload {
  location?: string;
}

export interface ScheduledEventUserPayload {
  guild_scheduled_event_id: snowflake;
  user: UserPayload;
  member?: GuildMemberPayload;
}

export interface GetScheduledEventsPayload {
  with_user_count?: boolean;
}

export interface CreateScheduledEventPayload extends Reasonable {
  channel_id?: snowflake;
  entity_metadata?: ScheduledEventEntityMetadataPayload;
  name: string;
  privacy_level: ScheduledEventPrivacyLevel;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  description?: string;
  entity_type: ScheduledEventEntityType;
  image?: string;
}

export interface GetScheduledEventPayload {
  with_user_count?: boolean;
}

export interface EditScheduledEventPayload extends Reasonable {
  channel_id?: snowflake | null;
  entity_metadata?: ScheduledEventEntityMetadataPayload | null;
  name?: string;
  privacy_level?: ScheduledEventPrivacyLevel;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  description?: string | null;
  entity_type: ScheduledEventEntityType;
  status?: ScheduledEventStatus;
  image?: string;
}

export interface GetScheduledEventUsersParams {
  limit?: number;
  with_member?: boolean;
  before?: snowflake;
  after?: snowflake;
}
