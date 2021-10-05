import type { MemberPayload } from './guild.ts'

export enum VoiceOpcodes {
  IDENTIFY = 0,
  SELECT_PROTOCOL = 1,
  READY = 2,
  HEARTBEAT = 3,
  SESSION_DESCRIPTION = 4,
  SPEAKING = 6,
  HEARTBEAT_ACK = 6,
  RESUME = 7,
  HELLO = 8,
  RESUMED = 9,
  CLIENT_DISCONNECT = 13
}

export enum VoiceCloseCodes {
  UNKNOWN_OPCODE = 4001,
  NOT_AUTHENTICATED = 4003,
  AUTHENTICATION_FAILED = 4004,
  ALREADY_AUTHENTICATED = 4005,
  SESSION_NO_LONGER_VALID = 4006,
  SESSION_TIMEOUT = 4009,
  SERVER_NOT_FOUNT = 4011,
  UNKNOWN_PROTOCOL = 4012,
  DISCONNECTED = 4014,
  VOICE_SERVER_CRASHED = 4015,
  UNKNOWN_ENCRYPTION_MODE = 4016
}

export interface VoiceStatePayload {
  guild_id?: string
  channel_id: string | null
  user_id: string
  member?: MemberPayload
  session_id: string
  deaf: boolean
  mute: boolean
  self_deaf: boolean
  self_mute: boolean
  self_stream?: boolean
  self_video: boolean
  suppress: boolean
  request_to_speak_timestamp: string | null
}

/** Voice Region Structure */
export interface VoiceRegion {
  /** Unique ID for the region */
  id: string
  /** Name of the region */
  name: string
  /**
   * True if this is a vip-only server
   * @deprecated This field is no longer sent
   */
  vip: false
  /** True for a single server that is closest to the current user's client */
  optimal: boolean
  /** Whether this is a deprecated voice region (avoid switching to these) */
  deprecated: boolean
  /** Whether this is a custom voice region (used for events/etc) */
  custom: boolean
}
