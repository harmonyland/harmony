import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { UserPayload } from "../users/user.ts";

export interface ScheduledEventPayload {
  channel_id: null | snowflake;
  creator?: UserPayload;
  creator_id?: null | snowflake;
  description?: string;
  entity_id: null | snowflake;
  entity_metadata: ScheduledEventEntityMetadataPayload;
  entity_type: ScheduledEventEntityType;
  guild_id: snowflake;
  id: snowflake;
  image?: null | string;
  name: string;
  privacy_level: ScheduledEventPrivacyLevel;
  scheduled_end_time: null | string;
  scheduled_start_time: string;
  status: ScheduledEventStatus;
  user_cound?: number;
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
  member?: GuildMemberPayload;
  user: UserPayload;
}

export interface GetScheduledEventsPayload {
  with_user_count?: boolean;
}

export interface CreateScheduledEventPayload extends Reasonable {
  channel_id?: snowflake;
  description?: string;
  entity_metadata?: ScheduledEventEntityMetadataPayload;
  entity_type: ScheduledEventEntityType;
  image?: string;
  name: string;
  privacy_level: ScheduledEventPrivacyLevel;
  scheduled_end_time?: string;
  scheduled_start_time: string;
}

export interface GetScheduledEventPayload {
  with_user_count?: boolean;
}

export interface EditScheduledEventPayload extends Reasonable {
  channel_id?: null | snowflake;
  description?: null | string;
  entity_metadata?: null | ScheduledEventEntityMetadataPayload;
  entity_type: ScheduledEventEntityType;
  image?: string;
  name?: string;
  privacy_level?: ScheduledEventPrivacyLevel;
  scheduled_end_time?: string;
  scheduled_start_time?: string;
  status?: ScheduledEventStatus;
}

export interface GetScheduledEventUsersParams {
  after?: snowflake;
  before?: snowflake;
  limit?: number;
  with_member?: boolean;
}
