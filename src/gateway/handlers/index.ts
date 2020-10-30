import { GatewayEventHandler } from '../index.ts'
import { GatewayEvents } from '../../types/gatewayTypes.ts'
import { channelCreate } from './channelCreate.ts'
import { channelDelete } from './channelDelete.ts'
import { channelUpdate } from './channelUpdate.ts'
import { channelPinsUpdate } from './channelPinsUpdate.ts'
import { guildCreate } from './guildCreate.ts'
import { guildDelte as guildDelete } from './guildDelete.ts'
import { guildUpdate } from './guildUpdate.ts'
import { guildBanAdd } from './guildBanAdd.ts'
import { ready } from './ready.ts'
import { guildBanRemove } from './guildBanRemove.ts'

export const gatewayHandlers: {
  [eventCode in GatewayEvents]: GatewayEventHandler | undefined
} = {
  READY: ready,
  RECONNECT: undefined,
  RESUMED: undefined,
  CHANNEL_CREATE: channelCreate,
  CHANNEL_DELETE: channelDelete,
  CHANNEL_UPDATE: channelUpdate,
  CHANNEL_PINS_UPDATE: channelPinsUpdate,
  GUILD_CREATE: guildCreate,
  GUILD_DELETE: guildDelete,
  GUILD_UPDATE: guildUpdate,
  GUILD_BAN_ADD: guildBanAdd,
  GUILD_BAN_REMOVE: guildBanRemove,
  GUILD_EMOJIS_UPDATE: undefined,
  GUILD_INTEGRATIONS_UPDATE: undefined,
  GUILD_MEMBER_ADD: undefined,
  GUILD_MEMBER_REMOVE: undefined,
  GUILD_MEMBER_UPDATE: undefined,
  GUILD_MEMBERS_CHUNK: undefined,
  GUILD_ROLE_CREATE: undefined,
  GUILD_ROLE_UPDATE: undefined,
  GUILD_ROLE_DELETE: undefined,
  INVITE_CREATE: undefined,
  INVITE_DELETE: undefined,
  MESSAGE_CREATE: undefined,
  MESSAGE_UPDATE: undefined,
  MESSAGE_DELETE: undefined,
  MESSAGE_DELETE_BULK: undefined,
  MESSAGE_REACTION_ADD: undefined,
  MESSAGE_REACTION_REMOVE: undefined,
  MESSAGE_REACTION_REMOVE_ALL: undefined,
  MESSAGE_REACTION_REMOVE_EMOJI: undefined,
  PRESENCE_UPDATE: undefined,
  TYPING_START: undefined,
  USER_UPDATE: undefined,
  VOICE_SERVER_UPDATE: undefined,
  WEBHOOKS_UPDATE: undefined
}
