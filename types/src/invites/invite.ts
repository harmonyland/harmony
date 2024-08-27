import { ApplicationPayload } from "../applications/application.ts";
import { ChannelPayload } from "../channels/base.ts";
import { snowflake } from "../common.ts";
import { GuildPayload } from "../guilds/guild.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { ScheduledEventPayload } from "../scheduledEvent/scheduledEvent.ts";
import { UserPayload } from "../users/user.ts";

export interface InvitePayload {
  approximate_member_count?: number;
  approximate_presence_count?: number;
  channel: ChannelPayload | null;
  code: string;
  expires_at?: null | string;
  guild?: GuildPayload;
  guild_scheduled_event?: ScheduledEventPayload;
  inviter?: UserPayload;
  stage_instance?: InviteStageInstancePayload;
  target_application?: ApplicationPayload;
  target_type?: InviteTargetType;
  target_user?: UserPayload;
}

export enum InviteTargetType {
  STREAM = 1,
  EMBEDDED_APPLICATION = 2,
}

export interface InviteStageInstancePayload {
  members: GuildMemberPayload[];
  participant_count: number;
  speaker_count: number;
  topic: string;
}

export interface InviteMetadataPayload {
  created_at: string;
  max_age: number;
  max_uses: number;
  temporary: boolean;
  uses: number;
}

export interface GetInviteParams {
  guild_scheduled_event_id?: snowflake;
  with_counts?: boolean;
  with_expiration?: boolean;
}
