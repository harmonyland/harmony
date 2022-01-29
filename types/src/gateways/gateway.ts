import { ApplicationPayload } from "../applications/application.ts";
import { ChannelPayload } from "../channels/base.ts";
import { MessagePayload } from "../channels/message.ts";
import { GuildPayload } from "../guilds/guild.ts";
import { ScheduledEventPayload } from "../scheduledEvent/scheduledEvent.ts";
import { StageInstancePayload } from "../stageInstances/stage.ts";
import { UserPayload } from "../users/user.ts";
import { ActivityPayload } from "./activity.ts";
import {
  GatewayGuildBanAddPayload,
  GatewayGuildBanRemovePayload,
  GatewayGuildEmojisUpdatePayload,
  GatewayGuildIntegrationsUpdatePayload,
  GatewayGuildMemberAddPayload,
  GatewayGuildMemberChunkPayload,
  GatewayGuildMemberRemovePayload,
  GatewayGuildMemberUpdatePayload,
  GatewayGuildRoleCreatePayload,
  GatewayGuildRoleDeletePayload,
  GatewayGuildRoleUpdatePayload,
  GatewayGuildStickersUpdatePayload,
} from "./guild.ts";
import {
  GatewayIntegrationCreatePayload,
  GatewayIntegrationDeletePayload,
  GatewayIntegrationUpdatePayload,
} from "./integration.ts";
import {
  GatewayInviteCreatePayload,
  GatewayInviteDeletePayload,
} from "./invite.ts";
import {
  GatewayMessageDeleteBulkPayload,
  GatewayMessageDeletePayload,
  GatewayMessageReactionAddPayload,
  GatewayMessageReactionRemoveAllPayload,
  GatewayMessageReactionRemoveEmojiPayload,
  GatewayMessageReactionRemovePayload,
} from "./message.ts";
import { GatewayOpcode } from "./opcode.ts";
import {
  GatewayScheduledEventUserAddPayload,
  GatewayScheduledEventUserRemovePayload,
  GatewayThreadListSyncPayload,
  GatewayThreadMembersUpdatePayload,
  GatewayThreadMemberUpdatePayload,
} from "./thread.ts";

export interface GatewayPayload {
  op: GatewayOpcode;
  d: GatewayDataType;
  s: number | null;
  t: string | null;
}

export type GatewayDataType =
  | GatewayHelloPayload
  | GatewayIdentifyPayload
  | GatewayResumePayload
  | HeartbeatPayload
  | GetGatewayGuildMembersPayload
  | EditGatewayPresencePayload
  | GatewayReadyPayload
  | Reasumable
  | ChannelPayload
  | GatewayThreadListSyncPayload
  | GatewayThreadMemberUpdatePayload
  | GatewayThreadMembersUpdatePayload
  | GatewayChannelPinsUpdatePayload
  | GuildPayload
  | GatewayGuildBanAddPayload
  | GatewayGuildBanRemovePayload
  | GatewayGuildEmojisUpdatePayload
  | GatewayGuildStickersUpdatePayload
  | GatewayGuildIntegrationsUpdatePayload
  | GatewayGuildMemberAddPayload
  | GatewayGuildMemberRemovePayload
  | GatewayGuildMemberUpdatePayload
  | GatewayGuildMemberChunkPayload
  | GatewayGuildRoleCreatePayload
  | GatewayGuildRoleUpdatePayload
  | GatewayGuildRoleDeletePayload
  | ScheduledEventPayload
  | GatewayScheduledEventUserAddPayload
  | GatewayScheduledEventUserRemovePayload
  | GatewayIntegrationCreatePayload
  | GatewayIntegrationUpdatePayload
  | GatewayIntegrationDeletePayload
  | GatewayInviteCreatePayload
  | GatewayInviteDeletePayload
  | MessagePayload
  | GatewayMessageDeletePayload
  | GatewayMessageDeleteBulkPayload
  | GatewayMessageReactionAddPayload
  | GatewayMessageReactionRemovePayload
  | GatewayMessageReactionRemoveAllPayload
  | GatewayMessageReactionRemoveEmojiPayload
  | GatewayWebhookUpdatePayload
  | StageInstancePayload;

export interface ConnectGatewayParams {
  v: number;
  encoding: "json" | "etf";
  compress?: "zlib-stream";
}

export interface GatewayHelloPayload {
  heartbeat_interval: number;
}

export interface GatewayIdentifyPayload {
  token: string;
  intents: number;
  properties: {
    $os: string;
    $browser: string;
    $device: string;
  };
  compress?: boolean;
  large_threshold?: number;
  shard?: [number, number];
  presence?: EditGatewayPresencePayload;
}

export interface GatewayResumePayload {
  token: string;
  session_id: string;
  seq: number;
}

export type HeartbeatPayload = number;
export type Reasumable = boolean;

export interface GetGatewayGuildMembersPayload {
  guild_id: string;
  query?: string;
  limit: number;
  presence?: boolean;
  user_ids?: string | string[];
  nonce?: string;
}

export interface EditGatewayPresencePayload {
  since: number | null;
  activities: ActivityPayload[];
  status: StatusType;
  afk: boolean;
}

export type StatusType = "online" | "dnd" | "idle" | "invisible" | "offline";

export interface GatewayReadyPayload {
  v: number;
  user: UserPayload;
  guilds: GuildPayload[];
  session_id: string;
  shard?: [number, number];
  application: ApplicationPayload;
}

export interface GatewayChannelPinsUpdatePayload {
  guild_id?: string;
  channel_id: string;
  last_pin_timestamp?: string | null;
}

export interface GatewayWebhookUpdatePayload {
  guild_id: string;
  channel_id: string;
}

export interface GetGatewayBotPayload {
  url: string;
  shards: number;
  session_start_limit: SessionStartLimitPayload;
}

export interface SessionStartLimitPayload {
  total: number;
  remaning: number;
  reset_after: number;
  max_concurrency: number;
}
