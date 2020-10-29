// https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway
// https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events
import { EmojiPayload } from './emojiTypes.ts'
import { MemberPayload } from './guildTypes.ts'
import { ActivityPayload, PresenceUpdatePayload } from './presenceTypes.ts'
import { RolePayload } from './roleTypes.ts'
import { UserPayload } from './userTypes.ts'

/**
 * Gateway OPcodes from Discord docs.
 */
enum GatewayOpcodes { // 문서를 확인해본 결과 Opcode 5번은 비어있다. - UnderC -
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
enum GatewayCloseCodes {
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

enum GatewayIntents {
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

enum GatewayEvents {
  Hello = 'HELLO',
  Ready = 'READY',
  Resumed = 'RESUMED',
  Reconnect = 'RECONNECT',
  Invalid_Session = 'INVALID_SESSION',
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
  Message_Delete = 'MESSAG_DELETE',
  Message_Delete_Bulk = 'MESSAGE_DELETE_BULK',
  Message_Reaction_Add = 'MESSAGE_REACTION_ADD',
  Message_Reaction_Remove = 'MESSAGE_REACTION_REMOVE',
  Message_Reaction_Remove_All = 'MESSAGE_REACTION_REMOVE_ALL',
  Message_Reaction_Remove_Emoji = 'MESSAGE_REACTION_REMOVE_EMOJI',
  Presence_Update = 'PRESENCE_UPDATE',
  Typing_Start = 'TYPING_START',
  User_Update = 'USER_UPDATE',
  Voice_State_Update = 'VOICE_STATE_UPDATE',
  Voice_Server_Update = 'VOICE_SERVER_UPDATE',
  Webhooks_Update = 'WEBHOOKS_UPDATE'
}

interface IdentityPayload {
  token: string
  properties: IdentityConnection
  compress?: boolean
  large_threshold?: number
  shard?: number[]
  presence?: UpdateStatus
  guildSubscriptions?: boolean
  intents: number
}

enum UpdateStatus {
  online = 'online',
  dnd = 'dnd',
  afk = 'idle',
  invisible = 'invisible',
  offline = 'offline'
}

interface IdentityConnection {
  $os: 'darwin' | 'windows' | 'linux' | 'custom os'
  $browser: 'discord.deno'
  $device: 'discord.deno'
}

interface Resume {
  token: string
  session_id: string
  seq: number
}

interface GuildRequestMembers {
  guild_id: string | string[]
  query?: string
  limit: number
  presences?: boolean
  user_ids?: string | string[]
  nonce?: string
}

interface GatewayVoiceStateUpdate {
  guild_id: string
  channel_id: string
  self_mute: boolean
  self_deaf: boolean
}

interface GatewayStatusUpdate {
  since: number | undefined
  activities: ActivityPayload[]
  status: string
  afk: boolean
}

interface Hello {
  heartbeat_interval: number
}

interface ReadyEvent {
  v: number
  user: UserPayload
  privateChannels: []
  guilds: []
  session_id: string
  shard?: number[]
}

interface ChannelPinsUpdate {
  guild_id?: string
  channel_id: string
  last_pin_timestamp?: string
}

interface GuildBanAdd {
  guild_id: string
  user: UserPayload
}

interface GuildBanRemove {
  guild_id: string
  user: UserPayload
}

interface GuildEmojiUpdate {
  guild_id: string
  emojis: []
}

interface GuildIntegrationsUpdate {
  guild_id: string
}

interface GuildMemberAddExtra {
  guild_id: string
}

interface GuildMemberRemove {
  guild_id: string
  user: UserPayload
}
interface GuildMemberUpdate {
  guild_id: string
  roles: string[]
  user: UserPayload
  nick?: string | undefined
  joined_at: string
  premium_since?: string | undefined
}

interface GuildMemberChunk {
  guild_id: string
  members: MemberPayload[]
  chunk_index: number
  chunk_count: number
  not_found?: []
  presences?: PresenceUpdatePayload[]
  nonce?: string
}

interface GuildRoleCreate {
  guild_id: string
  role: RolePayload
}

interface GuildRoleUpdate {
  guild_id: string
  role: RolePayload
}

interface GuildRoleDelete {
  guild_id: string
  role_id: string
}

interface InviteCreate {
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

interface InviteDelete {
  channel_id: string
  guild_id?: string
  code: string
}

interface MessageDelete {
  id: string
  channel_id: string
  guild_id?: string
}

interface MessageDeleteBulk {
  ids: string[]
  channel_id: string
  guild_id: string
}

interface MessageReactionAdd {
  user_id: string
  channel_id: string
  message_id: string
  guild_id?: string
  emoji: EmojiPayload
}

interface MessageReactionRemove {
  user_id: string
  channel_id: string
  message_id: string
  guild_id?: string
  emoji: EmojiPayload
}

interface MessageReactionRemoveAll {
  channel_id: string
  guild_id?: string
  message_id: string
  emoji: EmojiPayload
}

interface MessageReactionRemove {
  channel_id: string
  guild_id?: string
  message_id: string
  emoji: EmojiPayload
}

interface PresenceUpdate {
  user: UserPayload
  guild_id: string
  status: string
  activities: ActivityPayload[]
  client_status: UpdateStatus[]
}

interface CilentStatus {
  desktop?: string
  moblie?: string
  web?: string
}

interface Activity {
  name: string
  type: number
  url?: string | undefined
  created_at: number
  timestamps?: string
  application_id: string
  details?: string | undefined
  state?: string | undefined
  emoji?: EmojiPayload | undefined
  party?: ActivityParty
  assets?: ActivityAssets
  secrets?: ActivitySecrets
  instance?: boolean
  flags?: number
}

enum ActivityTypes {
  GAME = 0,
  STREAMING = 1,
  LISTENING = 2,
  CUSTOM = 4,
  COMPETING = 5
}

interface ActivityTimestamps {
  start?: number
  end?: number
}

interface ActivityEmoji {
  name: string
  id?: string
  animated?: boolean
}

interface ActivityParty {
  id?: string
  size?: number[]
}

interface ActivityAssets {
  large_image?: string
  large_text?: string
  small_image?: string
  small_text?: string
}

interface ActivitySecrets {
  join?: string
  spectate?: string
  match?: string
}

enum ActivityFlags {
  INSTANCE = 1 << 0,
  JOIN = 1 << 1,
  SPECTATE = 1 << 2,
  JOIN_REQUEST = 1 << 3,
  SYNC = 1 << 4,
  PLAY = 1 << 5
}

interface TypeStart {
  channel_id: string
  guild_id?: string
  user_id: string
  timestamp: number
  member?: MemberPayload
}

interface VoiceServerUpdate {
  token: string
  guild_id: string
  endpoint: string
}

interface WebhooksUpdate {
  guild_id: string
  channel_id: string
}

//https://discord.com/developers/docs/topics/gateway#typing-start-typing-start-event-fields
export { GatewayCloseCodes, GatewayOpcodes, GatewayIntents, GatewayEvents }
