import type {
  ApplicationCommandPermissions,
  AutoModerationRulePayload,
  ChannelPayload,
  GatewayAutoModerationActionExecutionEventPayload,
  GatewayChannelPinsUpdatePayload,
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
  GatewayHelloPayload,
  GatewayIntegrationCreatePayload,
  GatewayIntegrationDeletePayload,
  GatewayIntegrationUpdatePayload,
  GatewayInviteCreatePayload,
  GatewayInviteDeletePayload,
  GatewayMessageDeleteBulkPayload,
  GatewayMessageDeletePayload,
  GatewayMessageReactionAddPayload,
  GatewayMessageReactionRemoveAllPayload,
  GatewayMessageReactionRemoveEmojiPayload,
  GatewayMessageReactionRemovePayload,
  GatewayPayload,
  GatewayPresenceUpdatePayload,
  GatewayReadyPayload,
  GatewayScheduledEventUserAddPayload,
  GatewayScheduledEventUserRemovePayload,
  GatewayThreadListSyncPayload,
  GatewayThreadMembersUpdatePayload,
  GatewayThreadMemberUpdatePayload,
  GatewayTypingStartPayload,
  GatewayVoiceServerUpdatePayload,
  GatewayWebhookUpdatePayload,
  GuildPayload,
  InteractionPayload,
  MessagePayload,
  ScheduledEventPayload,
  StageInstancePayload,
  UserPayload,
  VoiceStatePayload,
} from "../../../types/mod.ts";

export type GatewayEvents = {
  HELLO: [GatewayHelloPayload];
  HEARTBEAT_ACK: [];
  RECONNECT: [];
  INVALID_SESSION: [];
  READY: [GatewayReadyPayload];
  RESUMED: [null];
  APPLICATION_COMMAND_PERMISSIONS_UPDATE: [ApplicationCommandPermissions];
  AUTO_MODERATION_RULE_CREATE: [AutoModerationRulePayload];
  AUTO_MODERATION_RULE_UPDATE: [AutoModerationRulePayload];
  AUTO_MODERATION_RULE_DELETE: [AutoModerationRulePayload];
  AUTO_MODERATION_ACTION_EXECUTE: [
    GatewayAutoModerationActionExecutionEventPayload,
  ];
  CHANNEL_CREATE: [ChannelPayload];
  CHANNEL_UPDATE: [ChannelPayload];
  CHANNEL_DELETE: [ChannelPayload];
  CHANNEL_PINS_UPDATE: [GatewayChannelPinsUpdatePayload];
  THREAD_CREATE: [ChannelPayload];
  THREAD_UPDATE: [ChannelPayload];
  THREAD_DELETE: [ChannelPayload];
  THREAD_LIST_SYNC: [GatewayThreadListSyncPayload];
  THREAD_MEMBER_UPDATE: [GatewayThreadMemberUpdatePayload];
  THREAD_MEMBERS_UPDATE: [GatewayThreadMembersUpdatePayload];
  GUILD_CREATE: [GuildPayload];
  GUILD_UPDATE: [GuildPayload];
  GUILD_DELETE: [GuildPayload];
  GUILD_BAN_ADD: [GatewayGuildBanAddPayload];
  GUILD_BAN_REMOVE: [GatewayGuildBanRemovePayload];
  GUILD_EMOJIS_UPDATE: [GatewayGuildEmojisUpdatePayload];
  GUILD_STICKERS_UPDATE: [GatewayGuildStickersUpdatePayload];
  GUILD_INTEGRATIONS_UPDATE: [GatewayGuildIntegrationsUpdatePayload];
  GUILD_MEMBER_ADD: [GatewayGuildMemberAddPayload];
  GUILD_MEMBER_REMOVE: [GatewayGuildMemberRemovePayload];
  GUILD_MEMBER_UPDATE: [GatewayGuildMemberUpdatePayload];
  GUILD_MEMBERS_CHUNK: [GatewayGuildMemberChunkPayload];
  GUILD_ROLE_CREATE: [GatewayGuildRoleCreatePayload];
  GUILD_ROLE_UPDATE: [GatewayGuildRoleUpdatePayload];
  GUILD_ROLE_DELETE: [GatewayGuildRoleDeletePayload];
  GUILD_SCHEDULED_EVENT_CREATE: [ScheduledEventPayload];
  GUILD_SCHEDULED_EVENT_UPDATE: [ScheduledEventPayload];
  GUILD_SCHEDULED_EVENT_DELETE: [ScheduledEventPayload];
  GUILD_SCHEDULED_EVENT_USER_ADD: [GatewayScheduledEventUserAddPayload];
  GUILD_SCHEDULED_EVENT_USER_REMOVE: [GatewayScheduledEventUserRemovePayload];
  INTEGRATION_CREATE: [GatewayIntegrationCreatePayload];
  INTEGRATION_UPDATE: [GatewayIntegrationUpdatePayload];
  INTEGRATION_DELETE: [GatewayIntegrationDeletePayload];
  INTERACTION_CREATE: [InteractionPayload];
  INVITE_CREATE: [GatewayInviteCreatePayload];
  INVITE_DELETE: [GatewayInviteDeletePayload];
  MESSAGE_CREATE: [MessagePayload];
  MESSAGE_UPDATE: [MessagePayload];
  MESSAGE_DELETE: [GatewayMessageDeletePayload];
  MESSAGE_DELETE_BULK: [GatewayMessageDeleteBulkPayload];
  MESSAGE_REACTION_ADD: [GatewayMessageReactionAddPayload];
  MESSAGE_REACTION_REMOVE: [GatewayMessageReactionRemovePayload];
  MESSAGE_REACTION_REMOVE_ALL: [GatewayMessageReactionRemoveAllPayload];
  MESSAGE_REACTION_REMOVE_EMOJI: [GatewayMessageReactionRemoveEmojiPayload];
  PRESENCE_UPDATE: [GatewayPresenceUpdatePayload];
  STAGE_INSTANCE_CREATE: [StageInstancePayload];
  STAGE_INSTANCE_DELETE: [StageInstancePayload];
  STAGE_INSTANCE_UPDATE: [StageInstancePayload];
  TYPING_START: [GatewayTypingStartPayload];
  USER_UPDATE: [UserPayload];
  VOICE_STATE_UPDATE: [VoiceStatePayload];
  VOICE_SERVER_UPDATE: [GatewayVoiceServerUpdatePayload];
  WEBHOOKS_UPDATE: [GatewayWebhookUpdatePayload];
  RAW: [GatewayPayload];
  CLOSED: [number, boolean, boolean];
  CONNECTED: [];
  ERROR: [Event | ErrorEvent];
};
export type ShardedGatewayEvents = {
  [K in keyof GatewayEvents]: [number, ...GatewayEvents[K]];
};
