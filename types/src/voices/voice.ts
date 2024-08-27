import { snowflake } from "../common.ts";
import { GuildMemberPayload } from "../guilds/member.ts";

export interface VoiceStatePayload {
  channel_id: snowflake;
  deaf: boolean;
  guild_id?: snowflake;
  member?: GuildMemberPayload;
  mute: boolean;
  request_to_speak_timestamp: null | string;
  self_deaf: boolean;
  self_mute: boolean;
  self_stream?: boolean;
  self_video: boolean;
  session_id: string;
  suppress: boolean;
  user_id: snowflake;
}

export interface VoiceRegionPayload {
  custom: boolean;
  deprecated: boolean;
  id: string;
  name: string;
  optimal: boolean;
}
