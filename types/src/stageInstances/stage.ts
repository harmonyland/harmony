import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";

export interface StageInstancePayload {
  channel_id: snowflake;
  discoverable_disabled: boolean;
  guild_id: snowflake;
  guild_scheduled_event_id: null | snowflake;
  id: snowflake;
  privacy_level: StagePrivacyLevel;
  topic: string;
}

export enum StagePrivacyLevel {
  PUBLIC = 1,
  GUILD_ONLY = 2,
}

export interface CreateStageInstancePayload extends Reasonable {
  channel_id: snowflake;
  guild_scheduled_event_id?: snowflake;
  privacy_level?: StagePrivacyLevel;
  send_start_notification?: boolean;
  topic: string;
}

export interface EditStageInstancePayload extends Reasonable {
  privacy_level?: StagePrivacyLevel;
  topic?: string;
}
