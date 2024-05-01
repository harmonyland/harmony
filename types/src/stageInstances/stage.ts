import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";

export interface StageInstancePayload {
  id: snowflake;
  guild_id: snowflake;
  channel_id: snowflake;
  topic: string;
  privacy_level: StagePrivacyLevel;
  discoverable_disabled: boolean;
  guild_scheduled_event_id: snowflake | null;
}

export enum StagePrivacyLevel {
  PUBLIC = 1,
  GUILD_ONLY = 2,
}

export interface CreateStageInstancePayload extends Reasonable {
  channel_id: snowflake;
  topic: string;
  privacy_level?: StagePrivacyLevel;
  send_start_notification?: boolean;
  guild_scheduled_event_id?: snowflake;
}

export interface EditStageInstancePayload extends Reasonable {
  topic?: string;
  privacy_level?: StagePrivacyLevel;
}
