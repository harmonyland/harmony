// https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice
import { MemberPayload } from './guild.ts'

export enum VoiceOpcodes { // add VoiceOpcodes - UnderC -
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
}
