import { snowflake } from "../common.ts";

export interface ActivityPayload {
  application_id?: snowflake;
  assets?: ActivityAsset;
  buttons?: ActivityButton[];
  created_at: number;
  details?: null | string;
  emoji?: ActivityEmoji | null;
  flags?: number;
  instance?: boolean;
  name: string;
  party?: ActivityParty;
  secrets?: ActivitySecret;
  state?: null | string;
  timestamps?: ActivityTimestamps;
  type: ActivityType;
  url?: null | string;
}

export enum ActivityType {
  GAME = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM = 4,
  COMPETING = 5,
}

export interface ActivityTimestamps {
  end?: number;
  start?: number;
}

export interface ActivityEmoji {
  animated?: boolean;
  id?: snowflake;
  name: string;
}

export interface ActivityParty {
  id?: string;
  size?: [number, number];
}

export interface ActivityAsset {
  large_image?: string;
  large_text?: string;
  small_image?: string;
  small_text?: string;
}

export interface ActivitySecret {
  join?: string;
  match?: string;
  spectate?: string;
}

export enum ActivityFlag {
  JOIN = 1 << 1,
  SPECTATE = 1 << 2,
  JOIN_REQUEST = 1 << 3,
  SYNC = 1 << 4,
  PLAY = 1 << 5,
  PARTY_PRIVACY_FRIENDS = 1 << 6,
  PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
  EMBEDDED = 1 << 8,
  INSTANCE = 1,
}

export interface ActivityButton {
  label: string;
  url: string;
}
