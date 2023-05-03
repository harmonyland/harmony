import { GuildMemberPayload } from "../guilds/member.ts";

export interface VoiceStatePayload {
  guild_id?: string;
  channel_id: string;
  user_id: string;
  member?: GuildMemberPayload;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_deaf: boolean;
  self_mute: boolean;
  self_stream?: boolean;
  self_video: boolean;
  suppress: boolean;
  request_to_speak_timestamp: string | null;
}

export interface VoiceRegionPayload {
  id: string;
  name: string;
  optimal: boolean;
  deprecated: boolean;
  custom: boolean;
}
