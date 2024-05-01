import { snowflake } from "../common.ts";

export interface AutoModerationRulePayload {
  id: snowflake;
  guild_id: snowflake;
  name: string;
  creator_id: snowflake;
  event_type: AutoModerationRuleEventType;
  trigger_type: AutoModerationRuleTriggerType;
  trigger_metadata: AutoModerationRuleTriggerMetadata;
  actions: AutoModerationRuleAction[];
  enabled: boolean;
  exempt_roles: snowflake[];
  exempt_channels: snowflake[];
}

export enum AutoModerationRuleEventType {
  MESSAGE_CREATE = 1,
}

export enum AutoModerationRuleTriggerType {
  KEYWORD = 1,
  SPAM = 3,
  KEYWORD_PRESET = 4,
  MENTION_SPAM = 5,
}

export interface AutoModerationRuleTriggerMetadata {
  keyword_filter: string[];
  regex_patterns: string[];
  presets: AutoModerationRuleKeywordPreset[];
  allow_list: string[];
  mention_total_limit: number;
  mention_raid_protection_enabled: boolean;
}

export enum AutoModerationRuleKeywordPreset {
  PROFANITY = 1,
  SEXUAL_CONTENT = 2,
  SLURS = 3,
}

export interface AutoModerationRuleAction {
  type: AutoModerationRuleActionType;
  metadata?: AutoModerationRuleActionMetadata;
}

export enum AutoModerationRuleActionType {
  BLOCK_MESSAGE = 1,
  SEND_ALERT_MESSAGE = 2,
  TIMEOUT = 3,
}

export interface AutoModerationRuleActionMetadata {
  channel_id: snowflake;
  duration_seconds: number;
  custom_message?: string;
}

export interface AutoModerationRuleCreatePayload {
  name: string;
  event_type: AutoModerationRuleEventType;
  trigger_type: AutoModerationRuleTriggerType;
  trigger_metadata?: AutoModerationRuleTriggerMetadata;
  actions: AutoModerationRuleAction[];
  enabled?: boolean;
  exempt_roles?: snowflake[];
  exempt_channels?: snowflake[];
}

export interface AutoModerationRuleUpdatePayload {
  name?: string;
  event_type?: AutoModerationRuleEventType;
  trigger_metadata?: AutoModerationRuleTriggerMetadata;
  actions?: AutoModerationRuleAction[];
  enabled?: boolean;
  exempt_roles?: snowflake[];
  exempt_channels?: snowflake[];
}
