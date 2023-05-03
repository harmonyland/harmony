import { GuildMemberPayload } from "../guilds/member.ts";
import { UserPayload } from "../users/user.ts";

export interface ScheduledEventPayload {
  id: string;
  guild_id: string;
  channel_id: string;
  creator_id: string;
  name: string;
  description?: string;
  scheduled_start_time: string;
  scheduled_end_time: string | null;
  privacy_level: ScheduledEventPrivacyLevel;
  status: ScheduledEventStatus;
  entity_type: ScheduledEventEntityType;
  entity_id: string | null;
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
  guild_scheduled_event_id: string;
  user: UserPayload;
  member?: GuildMemberPayload;
}

export interface GetScheduledEventsPayload {
  with_user_count?: boolean;
}

export interface CreateScheduledEventPayload {
  channel_id?: string;
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

export interface EditScheduledEventPayload {
  channel_id?: string | null;
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
  before?: string;
  after?: string;
}
