import { AutoModerationRulePayload } from "../autoMod/autoMod.ts";
import { OverwritePayload } from "../channels/guild.ts";
import { GuildThreadChannelPayload } from "../channels/thread.ts";
import { IntegrationPayload } from "../guilds/integration.ts";
import { RolePayload } from "../guilds/role.ts";
import { ApplicationCommandPayload } from "../interactions/command.ts";
import {
  ScheduledEventPayload,
  ScheduledEventPrivacyLevel,
  ScheduledEventStatus,
} from "../scheduledEvent/scheduledEvent.ts";
import { StagePrivacyLevel } from "../stageInstances/stage.ts";
import { StickerFormatType } from "../stickers/sticker.ts";
import { UserPayload } from "../users/user.ts";
import { WebhookPayload } from "../webhooks/webhook.ts";

export interface AuditLogPayload {
  application_commands: ApplicationCommandPayload[];
  audit_log_entries: AuditLogEntryPayload[];
  auto_moderation_rules: AutoModerationRulePayload[];
  guild_scheduled_events: ScheduledEventPayload[];
  integrations: IntegrationPayload[];
  threads: GuildThreadChannelPayload[];
  users: UserPayload[];
  webhooks: WebhookPayload[];
}

export interface AuditLogEntryPayload {
  target_id: string | null;
  changes?: AuditLogChangePayload[];
  user_id: string | null;
  id: string;
  action_type: AuditLogEvents;
  options?: AuditLogEntryInfoPayload;
  reason?: string;
}

export enum AuditLogEvents {
  GUILD_UPDATE = 1,
  CHANNEL_CREATE = 10,
  CHANNEL_UPDATE = 11,
  CHANNEL_DELETE = 12,
  CHANNEL_OVERWRITE_CREATE = 13,
  CHANNEL_OVERWRITE_UPDATE = 14,
  CHANNEL_OVERWRITE_DELETE = 15,
  MEMBER_KICK = 20,
  MEMBER_PRUNE = 21,
  MEMBER_BAN_ADD = 22,
  MEMBER_BAN_REMOVE = 23,
  MEMBER_UPDATE = 24,
  MEMBER_ROLE_UPDATE = 25,
  MEMBER_MOVE = 26,
  MEMBER_DISCONNECT = 27,
  BOT_ADD = 28,
  ROLE_CREATE = 30,
  ROLE_UPDATE = 31,
  ROLE_DELETE = 32,
  INVITE_CREATE = 40,
  INVITE_UPDATE = 41,
  INVITE_DELETE = 42,
  WEBHOOK_CREATE = 50,
  WEBHOOK_UPDATE = 51,
  WEBHOOK_DELETE = 52,
  EMOJI_CREATE = 60,
  EMOJI_UPDATE = 61,
  EMOJI_DELETE = 62,
  MESSAGE_DELETE = 72,
  MESSAGE_BULK_DELETE = 73,
  MESSAGE_PIN = 74,
  MESSAGE_UNPIN = 75,
  INTEGRATION_CREATE = 80,
  INTEGRATION_UPDATE = 81,
  INTEGRATION_DELETE = 82,
  STAGE_INSTANCE_CREATE = 83,
  STAGE_INSTANCE_UPDATE = 84,
  STAGE_INSTANCE_DELETE = 85,
  STICKER_CREATE = 90,
  STICKER_UPDATE = 91,
  STICKER_DELETE = 92,
  GUILD_SCHEDULED_EVENT_CREATE = 100,
  GUILD_SCHEDULED_EVENT_UPDATE = 101,
  GUILD_SCHEDULED_EVENT_DELETE = 102,
  THREAD_CREATE = 110,
  THREAD_UPDATE = 111,
  THREAD_DELETE = 112,
  APPLICATION_COMMAND_PERMISSION_UPDATE = 121,
  AUTO_MODERATION_RULE_CREATE = 140,
  AUTO_MODERATION_RULE_UPDATE = 141,
  AUTO_MODERATION_RULE_DELETE = 142,
  AUTO_MODERATION_BLOCK_MESSAGE = 143,
  AUTO_MODERATION_FLAG_TO_CHANNEL = 144,
  AUTO_MODERATION_USER_COMMUNICATION_DISABLED = 145,
}

export interface AuditLogEntryInfoPayload {
  application_id?: string;
  auto_moderation_rule_name?: string;
  auto_moderation_rule_trigger_type?: string;
  channel_id?: string;
  count?: string;
  delete_member_days?: string;
  id?: string;
  members_removed?: string;
  message_id?: string;
  role_name?: string;
  type?: string;
}

type AuditLogChangeValue =
  | string
  | number
  | boolean
  | StickerFormatType
  | OverwritePayload
  | StagePrivacyLevel
  | ScheduledEventPrivacyLevel
  | ScheduledEventStatus
  | RolePayload;

export interface AuditLogChangePayload {
  new_value?: AuditLogChangeValue;
  old_value?: AuditLogChangeValue;
  key: string;
}

export interface GetAuditLogParams {
  user_id?: string;
  action_type?: AuditLogEvents;
  before?: string;
  after?: string;
  limit?: number;
}
