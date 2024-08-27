import { snowflake } from "../common.ts";

export interface AutoModerationRulePayload {
  actions: AutoModerationRuleAction[];
  creator_id: snowflake;
  enabled: boolean;
  event_type: AutoModerationRuleEventType;
  exempt_channels: snowflake[];
  exempt_roles: snowflake[];
  guild_id: snowflake;
  id: snowflake;
  name: string;
  trigger_metadata: AutoModerationRuleTriggerMetadata;
  trigger_type: AutoModerationRuleTriggerType;
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
  allow_list: string[];
  keyword_filter: string[];
  mention_raid_protection_enabled: boolean;
  mention_total_limit: number;
  presets: AutoModerationRuleKeywordPreset[];
  regex_patterns: string[];
}

export enum AutoModerationRuleKeywordPreset {
  PROFANITY = 1,
  SEXUAL_CONTENT = 2,
  SLURS = 3,
}

export interface AutoModerationRuleAction {
  metadata?: AutoModerationRuleActionMetadata;
  type: AutoModerationRuleActionType;
}

export enum AutoModerationRuleActionType {
  BLOCK_MESSAGE = 1,
  SEND_ALERT_MESSAGE = 2,
  TIMEOUT = 3,
}

export interface AutoModerationRuleActionMetadata {
  channel_id: snowflake;
  custom_message?: string;
  duration_seconds: number;
}

export interface AutoModerationRuleCreatePayload {
  actions: AutoModerationRuleAction[];
  enabled?: boolean;
  event_type: AutoModerationRuleEventType;
  exempt_channels?: snowflake[];
  exempt_roles?: snowflake[];
  name: string;
  trigger_metadata?: AutoModerationRuleTriggerMetadata;
  trigger_type: AutoModerationRuleTriggerType;
}

export interface AutoModerationRuleUpdatePayload {
  actions?: AutoModerationRuleAction[];
  enabled?: boolean;
  event_type?: AutoModerationRuleEventType;
  exempt_channels?: snowflake[];
  exempt_roles?: snowflake[];
  name?: string;
  trigger_metadata?: AutoModerationRuleTriggerMetadata;
}
