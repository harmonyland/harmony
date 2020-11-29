import { GatewayEventHandler } from "../index.ts";
import { GatewayEvents } from "../../types/gateway.ts";
import { channelCreate } from "./channelCreate.ts";
import { channelDelete } from "./channelDelete.ts";
import { channelUpdate } from "./channelUpdate.ts";
import { channelPinsUpdate } from "./channelPinsUpdate.ts";
import { guildCreate } from "./guildCreate.ts";
import { guildDelte as guildDelete } from "./guildDelete.ts";
import { guildUpdate } from "./guildUpdate.ts";
import { guildBanAdd } from "./guildBanAdd.ts";
import { ready } from "./ready.ts";
import { guildBanRemove } from "./guildBanRemove.ts";
import { messageCreate } from "./messageCreate.ts";
import { resume } from "./resume.ts";
import { reconnect } from "./reconnect.ts";
import { messageDelete } from "./messageDelete.ts";
import { messageUpdate } from "./messageUpdate.ts";
import { guildEmojiUpdate } from "./guildEmojiUpdate.ts";
import { guildMemberAdd } from "./guildMemberAdd.ts";
import { guildMemberRemove } from "./guildMemberRemove.ts";
import { guildMemberUpdate } from "./guildMemberUpdate.ts";
import { guildRoleCreate } from "./guildRoleCreate.ts";
import { guildRoleDelete } from "./guildRoleDelete.ts";
import { guildRoleUpdate } from "./guildRoleUpdate.ts";
import { inviteCreate } from "./inviteCreate.ts";

export const gatewayHandlers: {
  [eventCode in GatewayEvents]: GatewayEventHandler | undefined;
} = {
  READY: ready,
  RECONNECT: reconnect,
  RESUMED: resume,
  CHANNEL_CREATE: channelCreate,
  CHANNEL_DELETE: channelDelete,
  CHANNEL_UPDATE: channelUpdate,
  CHANNEL_PINS_UPDATE: channelPinsUpdate,
  GUILD_CREATE: guildCreate,
  GUILD_DELETE: guildDelete,
  GUILD_UPDATE: guildUpdate,
  GUILD_BAN_ADD: guildBanAdd,
  GUILD_BAN_REMOVE: guildBanRemove,
  GUILD_EMOJIS_UPDATE: guildEmojiUpdate,
  GUILD_INTEGRATIONS_UPDATE: undefined,
  GUILD_MEMBER_ADD: guildMemberAdd,
  GUILD_MEMBER_REMOVE: guildMemberRemove,
  GUILD_MEMBER_UPDATE: guildMemberUpdate,
  GUILD_MEMBERS_CHUNK: undefined,
  GUILD_ROLE_CREATE: guildRoleCreate,
  GUILD_ROLE_UPDATE: guildRoleUpdate,
  GUILD_ROLE_DELETE: guildRoleDelete,
  INVITE_CREATE: inviteCreate,
  INVITE_DELETE: undefined,
  MESSAGE_CREATE: messageCreate,
  MESSAGE_UPDATE: messageUpdate,
  MESSAGE_DELETE: messageDelete,
  MESSAGE_DELETE_BULK: undefined,
  MESSAGE_REACTION_ADD: undefined,
  MESSAGE_REACTION_REMOVE: undefined,
  MESSAGE_REACTION_REMOVE_ALL: undefined,
  MESSAGE_REACTION_REMOVE_EMOJI: undefined,
  PRESENCE_UPDATE: undefined,
  TYPING_START: undefined,
  USER_UPDATE: undefined,
  VOICE_SERVER_UPDATE: undefined,
  WEBHOOKS_UPDATE: undefined,
};
