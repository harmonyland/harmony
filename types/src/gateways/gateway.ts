import { ApplicationPayload } from "../applications/application.ts";
import {
  AutoModerationRuleAction,
  AutoModerationRuleTriggerType,
} from "../autoMod/autoMod.ts";
import { ChannelPayload } from "../channels/base.ts";
import { MessagePayload } from "../channels/message.ts";
import { snowflake } from "../common.ts";
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
  d: GatewayDataType | null;
  op: GatewayOpcode;
  s: null | number;
  t: GatewayEventNames | null;
}

export type GatewayEventNames =
  | "CHANNEL_CREATE"
  | "CHANNEL_DELETE"
  | "CHANNEL_PINS_UPDATE"
  | "CHANNEL_UPDATE"
  | "GUILD_BAN_ADD"
  | "GUILD_BAN_REMOVE"
  | "GUILD_CREATE"
  | "GUILD_DELETE"
  | "GUILD_EMOJIS_UPDATE"
  | "GUILD_INTEGRATIONS_UPDATE"
  | "GUILD_MEMBER_ADD"
  | "GUILD_MEMBER_REMOVE"
  | "GUILD_MEMBER_UPDATE"
  | "GUILD_MEMBERS_CHUNK"
  | "GUILD_ROLE_CREATE"
  | "GUILD_ROLE_DELETE"
  | "GUILD_ROLE_UPDATE"
  | "GUILD_SCHEDULED_EVENT_CREATE"
  | "GUILD_SCHEDULED_EVENT_DELETE"
  | "GUILD_SCHEDULED_EVENT_UPDATE"
  | "GUILD_SCHEDULED_EVENT_USER_ADD"
  | "GUILD_SCHEDULED_EVENT_USER_REMOVE"
  | "GUILD_STICKERS_UPDATE"
  | "GUILD_UPDATE"
  | "INTEGRATION_CREATE"
  | "INTEGRATION_DELETE"
  | "INTEGRATION_UPDATE"
  | "INTERACTION_CREATE"
  | "INVITE_CREATE"
  | "INVITE_DELETE"
  | "MESSAGE_CREATE"
  | "MESSAGE_DELETE"
  | "MESSAGE_DELETE_BULK"
  | "MESSAGE_POLL_VOTE_ADD"
  | "MESSAGE_POLL_VOTE_REMOVE"
  | "MESSAGE_REACTION_ADD"
  | "MESSAGE_REACTION_REMOVE"
  | "MESSAGE_REACTION_REMOVE_ALL"
  | "MESSAGE_REACTION_REMOVE_EMOJI"
  | "MESSAGE_UPDATE"
  | "PRESENCE_UPDATE"
  | "READY"
  | "RESUMED"
  | "STAGE_INSTANCE_CREATE"
  | "STAGE_INSTANCE_DELETE"
  | "STAGE_INSTANCE_UPDATE"
  | "THREAD_CREATE"
  | "THREAD_DELETE"
  | "THREAD_LIST_SYNC"
  | "THREAD_MEMBER_UPDATE"
  | "THREAD_MEMBERS_UPDATE"
  | "THREAD_UPDATE"
  | "TYPING_START"
  | "USER_UPDATE"
  | "VOICE_SERVER_UPDATE"
  | "VOICE_STATE_UPDATE"
  | "WEBHOOKS_UPDATE";

export type GatewayDataType =
  | ChannelPayload
  | EditGatewayPresencePayload
  | GatewayAutoModerationActionExecutionEventPayload
  | GatewayChannelPinsUpdatePayload
  | GatewayGuildBanAddPayload
  | GatewayGuildBanRemovePayload
  | GatewayGuildEmojisUpdatePayload
  | GatewayGuildIntegrationsUpdatePayload
  | GatewayGuildMemberAddPayload
  | GatewayGuildMemberChunkPayload
  | GatewayGuildMemberRemovePayload
  | GatewayGuildMemberUpdatePayload
  | GatewayGuildRoleCreatePayload
  | GatewayGuildRoleDeletePayload
  | GatewayGuildRoleUpdatePayload
  | GatewayGuildStickersUpdatePayload
  | GatewayHelloPayload
  | GatewayIdentifyPayload
  | GatewayIntegrationCreatePayload
  | GatewayIntegrationDeletePayload
  | GatewayIntegrationUpdatePayload
  | GatewayInviteCreatePayload
  | GatewayInviteDeletePayload
  | GatewayMessageDeleteBulkPayload
  | GatewayMessageDeletePayload
  | GatewayMessageReactionAddPayload
  | GatewayMessageReactionRemoveAllPayload
  | GatewayMessageReactionRemoveEmojiPayload
  | GatewayMessageReactionRemovePayload
  | GatewayPresenceUpdatePayload
  | GatewayReadyPayload
  | GatewayResumePayload
  | GatewayScheduledEventUserAddPayload
  | GatewayScheduledEventUserRemovePayload
  | GatewayThreadListSyncPayload
  | GatewayThreadMembersUpdatePayload
  | GatewayThreadMemberUpdatePayload
  | GatewayTypingStartPayload
  | GatewayVoiceServerUpdatePayload
  | GatewayWebhookUpdatePayload
  | GetGatewayGuildMembersPayload
  | GuildPayload
  | HeartbeatPayload
  | InteractionPayload
  | MessagePayload
  | MessagePollVoteAddPayload
  | MessagePollVoteRemovePayload
  | Reasumable
  | ScheduledEventPayload
  | StageInstancePayload
  | UserPayload
  | VoiceStatePayload;

export interface ConnectGatewayParams {
  compress?: "zlib-stream";
  encoding: "etf" | "json";
  v: number;
}

export interface GatewayHelloPayload {
  heartbeat_interval: number;
}

export interface GatewayIdentifyPayload {
  compress?: boolean;
  intents: number;
  large_threshold?: number;
  presence?: EditGatewayPresencePayload;
  properties: {
    browser: string;
    device: string;
    os: string;
  };
  shard?: [number, number];
  token: string;
}

export interface GatewayResumePayload {
  seq: number;
  session_id: snowflake;
  token: string;
}

export type HeartbeatPayload = null | number;
export type Reasumable = boolean;

export interface GetGatewayGuildMembersPayload {
  guild_id: snowflake;
  limit: number;
  nonce?: string;
  presence?: boolean;
  query?: string;
  user_ids?: snowflake | snowflake[];
}

export interface EditGatewayPresencePayload {
  activities: ActivityPayload[];
  afk: boolean;
  since: null | number;
  status: StatusType;
}

export type StatusType = "dnd" | "idle" | "invisible" | "offline" | "online";

export interface GatewayReadyPayload {
  application: ApplicationPayload;
  guilds: GuildPayload[];
  resume_gateway_url: string;
  session_id: string;
  shard?: [number, number];
  user: UserPayload;
  v: number;
}

export interface GatewayChannelPinsUpdatePayload {
  channel_id: snowflake;
  guild_id?: snowflake;
  last_pin_timestamp?: null | string;
}

export interface GatewayWebhookUpdatePayload {
  channel_id: snowflake;
  guild_id: snowflake;
}

export interface GetGatewayBotPayload {
  session_start_limit: SessionStartLimitPayload;
  shards: number;
  url: string;
}

export interface SessionStartLimitPayload {
  max_concurrency: number;
  remaning: number;
  reset_after: number;
  total: number;
}

export type ClientStatusType = "dnd" | "idle" | "online";

export interface ClientStatusPayload {
  desktop?: ClientStatusType;
  mobile?: ClientStatusType;
  web?: ClientStatusType;
}

export interface GatewayPresenceUpdatePayload {
  activities: ActivityPayload[];
  client_status: ClientStatusPayload;
  guild_id: snowflake;
  status: StatusType;
  user: UserPayload;
}

export interface GatewayTypingStartPayload {
  channel_id: snowflake;
  guild_id?: snowflake;
  member?: GuildMemberPayload;
  timestamp: number;
  user_id: snowflake;
}

export interface GatewayVoiceServerUpdatePayload {
  endpoint: null | string;
  guild_id: snowflake;
  token: string;
}

export interface GatewayAutoModerationActionExecutionEventPayload {
  action: AutoModerationRuleAction;
  alert_system_message_id?: snowflake;
  channel_id?: snowflake;
  content?: string;
  guild_id: snowflake;
  matched_content?: null | string;
  matched_keyword: null | string;
  message_id?: snowflake;
  rule_id: string;
  rule_trigger_type: AutoModerationRuleTriggerType;
  user_id: snowflake;
}

export interface MessagePollVoteAddPayload {
  answer_id: number;
  channel_id: snowflake;
  guild_id?: snowflake;
  message_id: snowflake;
  user_id: snowflake;
}

export type MessagePollVoteRemovePayload = MessagePollVoteAddPayload;
