export interface StageInstancePayload {
  id: string;
  guild_id: string;
  channel_id: string;
  topic: string;
  privacy_level: StagePrivacyLevel;
  discoverable_disabled: boolean;
}

export enum StagePrivacyLevel {
  PUBLIC = 1,
  GUILD_ONLY = 2,
}

export interface CreateStageInstancePayload {
  channel_id: string;
  topic: string;
  privacy_level?: StagePrivacyLevel;
}

export interface EditStageInstancePayload {
  topic?: string;
  privacy_level?: StagePrivacyLevel;
}
