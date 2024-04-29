import { ApplicationPayload } from "../applications/application.ts";
import { ChannelPayload } from "../channels/base.ts";
import { GuildPayload } from "../guilds/guild.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { ScheduledEventPayload } from "../scheduledEvent/scheduledEvent.ts";
import { UserPayload } from "../users/user.ts";

export interface InvitePayload {
  code: string;
  guild?: GuildPayload;
  channel: ChannelPayload | null;
  inviter?: UserPayload;
  target_type?: InviteTargetType;
  target_user?: UserPayload;
  target_application?: ApplicationPayload;
  approximate_presence_count?: number;
  approximate_member_count?: number;
  expires_at?: string | null;
  stage_instance?: InviteStageInstancePayload;
  guild_scheduled_event?: ScheduledEventPayload;
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
  uses: number;
  max_uses: number;
  max_age: number;
  temporary: boolean;
  created_at: string;
}

export interface GetInviteParams {
  with_counts?: boolean;
  with_expiration?: boolean;
  guild_scheduled_event_id?: string;
}
