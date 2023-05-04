import { ApplicationPayload } from "../applications/application.ts";
import {
  AutoModerationRuleAction,
  AutoModerationRuleTriggerType,
} from "../autoMod/autoMod.ts";
import { ChannelPayload } from "../channels/base.ts";
import { MessagePayload } from "../channels/message.ts";
import { GuildPayload } from "../guilds/guild.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { InteractionPayload } from "../interactions/interaction.ts";
import { ScheduledEventPayload } from "../scheduledEvent/scheduledEvent.ts";
import { StageInstancePayload } from "../stageInstances/stage.ts";
import { UserPayload } from "../users/user.ts";
import { VoiceStatePayload } from "../voices/voice.ts";
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
  d: GatewayDataType | null;
  s: number | null;
  t: GatewayEventNames | null;
}

export type GatewayEventNames =
  | "READY"
  | "RESUMED"
  | "CHANNEL_CREATE"
  | "CHANNEL_UPDATE"
  | "CHANNEL_DELETE"
  | "CHANNEL_PINS_UPDATE"
  | "THREAD_CREATE"
  | "THREAD_UPDATE"
  | "THREAD_DELETE"
  | "THREAD_LIST_SYNC"
  | "THREAD_MEMBER_UPDATE"
  | "THREAD_MEMBERS_UPDATE"
  | "GUILD_CREATE"
  | "GUILD_UPDATE"
  | "GUILD_DELETE"
  | "GUILD_BAN_ADD"
  | "GUILD_BAN_REMOVE"
  | "GUILD_EMOJIS_UPDATE"
  | "GUILD_STICKERS_UPDATE"
  | "GUILD_INTEGRATIONS_UPDATE"
  | "GUILD_MEMBER_ADD"
  | "GUILD_MEMBER_REMOVE"
  | "GUILD_MEMBER_UPDATE"
  | "GUILD_MEMBERS_CHUNK"
  | "GUILD_ROLE_CREATE"
  | "GUILD_ROLE_UPDATE"
  | "GUILD_ROLE_DELETE"
  | "GUILD_SCHEDULED_EVENT_CREATE"
  | "GUILD_SCHEDULED_EVENT_UPDATE"
  | "GUILD_SCHEDULED_EVENT_DELETE"
  | "GUILD_SCHEDULED_EVENT_USER_ADD"
  | "GUILD_SCHEDULED_EVENT_USER_REMOVE"
  | "INTEGRATION_CREATE"
  | "INTEGRATION_UPDATE"
  | "INTEGRATION_DELETE"
  | "INTERACTION_CREATE"
  | "INVITE_CREATE"
  | "INVITE_DELETE"
  | "MESSAGE_CREATE"
  | "MESSAGE_UPDATE"
  | "MESSAGE_DELETE"
  | "MESSAGE_DELETE_BULK"
  | "MESSAGE_REACTION_ADD"
  | "MESSAGE_REACTION_REMOVE"
  | "MESSAGE_REACTION_REMOVE_ALL"
  | "MESSAGE_REACTION_REMOVE_EMOJI"
  | "PRESENCE_UPDATE"
  | "STAGE_INSTANCE_CREATE"
  | "STAGE_INSTANCE_DELETE"
  | "STAGE_INSTANCE_UPDATE"
  | "TYPING_START"
  | "USER_UPDATE"
  | "VOICE_STATE_UPDATE"
  | "VOICE_SERVER_UPDATE"
  | "WEBHOOKS_UPDATE";

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
  | InteractionPayload
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
  | StageInstancePayload
  | UserPayload
  | VoiceStatePayload
  | GatewayPresenceUpdatePayload
  | GatewayTypingStartPayload
  | GatewayVoiceServerUpdatePayload
  | GatewayAutoModerationActionExecutionEventPayload;

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

export type HeartbeatPayload = number | null;
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

export type ClientStatusType = "online" | "idle" | "dnd";

export interface ClientStatusPayload {
  desktop?: ClientStatusType;
  mobile?: ClientStatusType;
  web?: ClientStatusType;
}

export interface GatewayPresenceUpdatePayload {
  user: UserPayload;
  guild_id: string;
  status: StatusType;
  activities: ActivityPayload[];
  client_status: ClientStatusPayload;
}

export interface GatewayTypingStartPayload {
  channel_id: string;
  guild_id?: string;
  user_id: string;
  timestamp: number;
  member?: GuildMemberPayload;
}

export interface GatewayVoiceServerUpdatePayload {
  token: string;
  guild_id: string;
  endpoint: string | null;
}

export interface GatewayAutoModerationActionExecutionEventPayload {
  guild_id: string;
  action: AutoModerationRuleAction;
  rule_id: string;
  rule_trigger_type: AutoModerationRuleTriggerType;
  user_id: string;
  channel_id?: string;
  message_id?: string;
  alert_system_message_id?: string;
  content?: string;
  matched_keyword: string | null;
  matched_content?: string | null;
}
