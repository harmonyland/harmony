// https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway
// https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events
import type { Guild } from '../structures/guild.ts'
import type { Member } from '../structures/member.ts'
import type { EmojiPayload } from './emoji.ts'
import type { GuildPayload, MemberPayload } from './guild.ts'
import type {
  ActivityGame,
  ActivityPayload,
  StatusType,
  ClientStatus
} from './presence.ts'
import type { RolePayload } from './role.ts'
import type { SlashCommandPayload } from './slashCommands.ts'
import type { UserPayload } from './user.ts'

/**
 * Gateway OPcodes from Discord docs.
 */
export enum GatewayOpcodes { // Opcode 5 is empty according to discord api docs.
  DISPATCH = 0,
  HEARTBEAT = 1,
  IDENTIFY = 2,
  PRESENCE_UPDATE = 3,
  VOICE_STATE_UPDATE = 4,
  RESUME = 6,
  RECONNECT = 7,
  REQUEST_GUILD_MEMBERS = 8,
  INVALID_SESSION = 9,
  HELLO = 10,
  HEARTBEAT_ACK = 11
}

/**
 * Gateway Close Codes from Discord docs.
 */
export enum GatewayCloseCodes {
  UNKNOWN_ERROR = 4000,
  UNKNOWN_OPCODE = 4001,
  DECODE_ERROR = 4002,
  NOT_AUTHENTICATED = 4003,
  AUTHENTICATION_FAILED = 4004,
  ALREADY_AUTHENTICATED = 4005,
  INVALID_SEQ = 4007,
  RATE_LIMITED = 4008,
  SESSION_TIMED_OUT = 4009,
  INVALID_SHARD = 4010,
  SHARDING_REQUIRED = 4011,
  INVALID_API_VERSION = 4012,
  INVALID_INTENTS = 4013,
  DISALLOWED_INTENTS = 4014
}

export enum GatewayIntents {
  GUILDS = 1 << 0,
  GUILD_MEMBERS = 1 << 1,
  GUILD_BANS = 1 << 2,
  GUILD_EMOJIS = 1 << 3,
  GUILD_INTEGRATIONS = 1 << 4,
  GUILD_WEBHOOKS = 1 << 5,
  GUILD_INVITES = 1 << 6,
  GUILD_VOICE_STATES = 1 << 7,
  GUILD_PRESENCES = 1 << 8,
  GUILD_MESSAGES = 1 << 9,
  GUILD_MESSAGE_REACTIONS = 1 << 10,
  GUILD_MESSAGE_TYPING = 1 << 11,
  DIRECT_MESSAGES = 1 << 12,
  DIRECT_MESSAGE_REACTIONS = 1 << 13,
  DIRECT_MESSAGE_TYPING = 1 << 13
}

export enum GatewayEvents {
  Ready = 'READY',
  Resumed = 'RESUMED',
  Reconnect = 'RECONNECT',
  Channel_Create = 'CHANNEL_CREATE',
  Channel_Update = 'CHANNEL_UPDATE',
  Channel_Delete = 'CHANNEL_DELETE',
  Channel_Pins_Update = 'CHANNEL_PINS_UPDATE',
  Guild_Create = 'GUILD_CREATE',
  Guild_Update = 'GUILD_UPDATE',
  Guild_Delete = 'GUILD_DELETE',
  Guild_Ban_Add = 'GUILD_BAN_ADD',
  Guild_Ban_Remove = 'GUILD_BAN_REMOVE',
  Guild_Emojis_Update = 'GUILD_EMOJIS_UPDATE',
  Guild_Integrations_Update = 'GUILD_INTEGRATIONS_UPDATE',
  Guild_Member_Add = 'GUILD_MEMBER_ADD',
  Guild_Member_Remove = 'GUILD_MEMBER_REMOVE',
  Guild_Member_Update = 'GUILD_MEMBER_UPDATE',
  Guild_Members_Chunk = 'GUILD_MEMBERS_CHUNK',
  Guild_Role_Create = 'GUILD_ROLE_CREATE',
  Guild_Role_Update = 'GUILD_ROLE_UPDATE',
  Guild_Role_Delete = 'GUILD_ROLE_DELETE',
  Invite_Create = 'INVITE_CREATE',
  Invite_Delete = 'INVITE_DELETE',
  Message_Create = 'MESSAGE_CREATE',
  Message_Update = 'MESSAGE_UPDATE',
  Message_Delete = 'MESSAGE_DELETE',
  Message_Delete_Bulk = 'MESSAGE_DELETE_BULK',
  Message_Reaction_Add = 'MESSAGE_REACTION_ADD',
  Message_Reaction_Remove = 'MESSAGE_REACTION_REMOVE',
  Message_Reaction_Remove_All = 'MESSAGE_REACTION_REMOVE_ALL',
  Message_Reaction_Remove_Emoji = 'MESSAGE_REACTION_REMOVE_EMOJI',
  Presence_Update = 'PRESENCE_UPDATE',
  Typing_Start = 'TYPING_START',
  User_Update = 'USER_UPDATE',
  Voice_Server_Update = 'VOICE_SERVER_UPDATE',
  Voice_State_Update = 'VOICE_STATE_UPDATE',
  Webhooks_Update = 'WEBHOOKS_UPDATE',
  Interaction_Create = 'INTERACTION_CREATE',
  Application_Command_Create = 'APPLICATION_COMMAND_CREATE',
  Application_Command_Update = 'APPLICATION_COMMAND_UPDATE',
  Application_Command_Delete = 'APPLICATION_COMMAND_DELETE',
  Thread_Create = 'THREAD_CREATE',
  Thread_Delete = 'THREAD_DELETE',
  Thread_Update = 'THREAD_UPDATE',
  Thread_Member_Update = 'THREAD_MEMBER_UPDATE',
  Thread_Members_Update = 'THREAD_MEMBERS_UPDATE',
  Thread_List_Sync = 'THREAD_LIST_SYNC'
}

export interface IdentityPayload {
  token: string
  properties: IdentityConnection
  compress?: boolean
  large_threshold?: number
  shard?: number[]
  presence?: StatusUpdatePayload
  guildSubscriptions?: boolean
  intents?: number
}

export interface IdentityConnection {
  $os: 'darwin' | 'windows' | 'linux' | 'custom os' | string
  $browser: 'harmony' | 'Firefox' | string
  $device: 'harmony' | string
  $referrer?: '' | string
  $referring_domain?: '' | string
}

export interface Resume {
  token: string
  session_id: string
  seq: number
}

export interface GuildRequestMembers {
  guild_id: string | string[]
  query?: string
  limit: number
  presences?: boolean
  user_ids?: string | string[]
  nonce?: string
}

export interface GatewayVoiceStateUpdate {
  guild_id: string
  channel_id: string
  self_mute: boolean
  self_deaf: boolean
}

export interface GatewayStatusUpdate {
  since: number | undefined
  activities: ActivityPayload[]
  status: string
  afk: boolean
}

export interface Hello {
  heartbeat_interval: number
}

export interface Ready {
  v: number
  user: UserPayload
  privateChannels: []
  guilds: GuildPayload[]
  session_id: string
  shard?: number[]
  application: { id: string; flags: number }
}

export interface ChannelPinsUpdatePayload {
  guild_id?: string
  channel_id: string
  last_pin_timestamp?: string
}

export interface GuildBanAddPayload {
  guild_id: string
  user: UserPayload
}

export interface GuildBanRemovePayload {
  guild_id: string
  user: UserPayload
}

export interface GuildEmojiUpdatePayload {
  guild_id: string
  emojis: EmojiPayload[]
}

export interface GuildIntegrationsUpdatePayload {
  guild_id: string
}

export interface GuildMemberAddPayload extends MemberPayload {
  guild_id: string
}

export interface GuildMemberRemovePayload {
  guild_id: string
  user: UserPayload
}
export interface GuildMemberUpdatePayload {
  guild_id: string
  roles: string[]
  user: UserPayload
  nick: string | null
  joined_at: string
  premium_since?: string | undefined
}

export interface GuildMemberChunkPayload {
  guild_id: string
  members: MemberPayload[]
  chunk_index: number
  chunk_count: number
  not_found?: []
  presences?: PresenceUpdatePayload[]
  nonce?: string
}

export interface GuildRoleCreatePayload {
  guild_id: string
  role: RolePayload
}

export interface GuildRoleUpdatePayload {
  guild_id: string
  role: RolePayload
}

export interface GuildRoleDeletePayload {
  guild_id: string
  role_id: string
}

export interface InviteCreatePayload {
  channel_id: string
  code: string
  created_at: string
  guild_id?: string
  inviter?: UserPayload
  max_age: number
  max_uses: number
  target_user?: UserPayload
  target_user_type?: number
  temporary: boolean
  uses: number
}

export interface InviteDeletePayload {
  channel_id: string
  guild_id?: string
  code: string
}

export interface MessageDeletePayload {
  id: string
  channel_id: string
  guild_id?: string
}

export interface MessageDeleteBulkPayload {
  ids: string[]
  channel_id: string
  guild_id: string
}

export interface MessageReactionAddPayload {
  user_id: string
  channel_id: string
  message_id: string
  guild_id?: string
  emoji: EmojiPayload
}

export interface MessageReactionRemovePayload {
  user_id: string
  channel_id: string
  message_id: string
  guild_id?: string
  emoji: EmojiPayload
}

export interface MessageReactionRemoveAllPayload {
  channel_id: string
  guild_id?: string
  message_id: string
}

export interface MessageReactionRemoveEmojiPayload {
  channel_id: string
  message_id: string
  guild_id?: string
  emoji: EmojiPayload
}

export interface PresenceUpdatePayload {
  user: UserPayload
  guild_id: string
  status: StatusType
  activities: ActivityPayload[]
  client_status: ClientStatus
}

export interface StatusUpdatePayload {
  status: StatusType
  activities: ActivityGame[] | null
  since: number | null
  afk: boolean
}

export interface TypeStart {
  channel_id: string
  guild_id?: string
  user_id: string
  timestamp: number
  member?: MemberPayload
}

export interface VoiceServerUpdatePayload {
  token: string
  guild_id: string
  endpoint: string
}

export interface WebhooksUpdatePayload {
  guild_id: string
  channel_id: string
}

export interface TypingStartPayload {
  channel_id: string
  user_id: string
  guild_id?: string
  timestamp: number
  member?: MemberPayload
}

export interface TypingStartGuildData {
  guild: Guild
  member: Member
}

export interface ApplicationCommandPayload extends SlashCommandPayload {
  guild_id?: string
}
