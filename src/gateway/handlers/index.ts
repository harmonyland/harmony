import { GatewayEventHandler } from '../index.ts'
import { GatewayEvents, TypingStartGuildData } from '../../types/gateway.ts'
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
import { messageCreate } from './messageCreate.ts'
import { resume } from './resume.ts'
import { reconnect } from './reconnect.ts'
import { messageDelete } from './messageDelete.ts'
import { messageUpdate } from './messageUpdate.ts'
import { guildEmojiUpdate } from './guildEmojiUpdate.ts'
import { guildMemberAdd } from './guildMemberAdd.ts'
import { guildMemberRemove } from './guildMemberRemove.ts'
import { guildMemberUpdate } from './guildMemberUpdate.ts'
import { guildRoleCreate } from './guildRoleCreate.ts'
import { guildRoleDelete } from './guildRoleDelete.ts'
import { guildRoleUpdate } from './guildRoleUpdate.ts'
import { guildIntegrationsUpdate } from './guildIntegrationsUpdate.ts'
import { webhooksUpdate } from './webhooksUpdate.ts'
import { messageDeleteBulk } from './messageDeleteBulk.ts'
import { userUpdate } from './userUpdate.ts'
import { typingStart } from './typingStart.ts'
import { Channel } from '../../structures/channel.ts'
import { GuildTextChannel, TextChannel } from '../../structures/textChannel.ts'
import { Guild } from '../../structures/guild.ts'
import { User } from '../../structures/user.ts'
import { Emoji } from '../../structures/emoji.ts'
import { Member } from '../../structures/member.ts'
import { Role } from '../../structures/role.ts'
import { Message } from '../../structures/message.ts'
import { Collection } from '../../utils/collection.ts'
import { voiceServerUpdate } from './voiceServerUpdate.ts'
import { voiceStateUpdate } from './voiceStateUpdate.ts'
import { VoiceState } from '../../structures/voiceState.ts'
import { messageReactionAdd } from './messageReactionAdd.ts'
import { messageReactionRemove } from './messageReactionRemove.ts'
import { messageReactionRemoveAll } from './messageReactionRemoveAll.ts'
import { messageReactionRemoveEmoji } from './messageReactionRemoveEmoji.ts'
import { guildMembersChunk } from './guildMembersChunk.ts'
import { presenceUpdate } from './presenceUpdate.ts'
import { inviteCreate } from './inviteCreate.ts'
import { inviteDelete } from './inviteDelete.ts'
import { MessageReaction } from '../../structures/messageReaction.ts'
import { Invite } from '../../structures/invite.ts'

export const gatewayHandlers: {
  [eventCode in GatewayEvents]: GatewayEventHandler | undefined
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
  GUILD_INTEGRATIONS_UPDATE: guildIntegrationsUpdate,
  GUILD_MEMBER_ADD: guildMemberAdd,
  GUILD_MEMBER_REMOVE: guildMemberRemove,
  GUILD_MEMBER_UPDATE: guildMemberUpdate,
  GUILD_MEMBERS_CHUNK: guildMembersChunk,
  GUILD_ROLE_CREATE: guildRoleCreate,
  GUILD_ROLE_UPDATE: guildRoleUpdate,
  GUILD_ROLE_DELETE: guildRoleDelete,
  INVITE_CREATE: inviteCreate,
  INVITE_DELETE: inviteDelete,
  MESSAGE_CREATE: messageCreate,
  MESSAGE_UPDATE: messageUpdate,
  MESSAGE_DELETE: messageDelete,
  MESSAGE_DELETE_BULK: messageDeleteBulk,
  MESSAGE_REACTION_ADD: messageReactionAdd,
  MESSAGE_REACTION_REMOVE: messageReactionRemove,
  MESSAGE_REACTION_REMOVE_ALL: messageReactionRemoveAll,
  MESSAGE_REACTION_REMOVE_EMOJI: messageReactionRemoveEmoji,
  PRESENCE_UPDATE: presenceUpdate,
  TYPING_START: typingStart,
  USER_UPDATE: userUpdate,
  VOICE_STATE_UPDATE: voiceStateUpdate,
  VOICE_SERVER_UPDATE: voiceServerUpdate,
  WEBHOOKS_UPDATE: webhooksUpdate,
}

export interface EventTypes {
  [name: string]: (...args: any[]) => void
}

export interface VoiceServerUpdateData {
  token: string
  endpoint: string
  guild: Guild
}

export interface ClientEvents extends EventTypes {
  ready: () => void
  reconnect: () => void
  resumed: () => void
  channelCreate: (channel: Channel) => void
  channelDelete: (channel: Channel) => void
  channelPinsUpdate: (before: TextChannel, after: TextChannel) => void
  channelUpdate: (before: Channel, after: Channel) => void
  guildBanAdd: (guild: Guild, user: User) => void
  guildBanRemove: (guild: Guild, user: User) => void
  guildCreate: (guild: Guild) => void
  guildDelete: (guild: Guild) => void
  guildEmojiAdd: (guild: Guild, emoji: Emoji) => void
  guildEmojiDelete: (guild: Guild, emoji: Emoji) => void
  guildEmojiUpdate: (guild: Guild, before: Emoji, after: Emoji) => void
  guildIntegrationsUpdate: (guild: Guild) => void
  guildMemberAdd: (member: Member) => void
  guildMemberRemove: (member: Member) => void
  guildMemberUpdate: (before: Member, after: Member) => void
  guildRoleCreate: (role: Role) => void
  guildRoleDelete: (role: Role) => void
  guildRoleUpdate: (before: Role, after: Role) => void
  guildUpdate: (before: Guild, after: Guild) => void
  messageCreate: (message: Message) => void
  messageDelete: (message: Message) => void
  messageDeleteBulk: (
    channel: GuildTextChannel,
    messages: Collection<string, Message>,
    uncached: Set<string>
  ) => void
  messageUpdate: (before: Message, after: Message) => void
  messageReactionAdd: (reaction: MessageReaction, user: User) => void
  messageReactionRemove: (reaction: MessageReaction, user: User) => void
  messageReactionRemoveAll: (message: Message) => void
  messageReactionRemoveEmoji: (message: Message, emoji: Emoji) => void
  typingStart: (
    user: User,
    channel: TextChannel,
    at: Date,
    guildData?: TypingStartGuildData
  ) => void
  inviteCreate: (invite: Invite) => void
  inviteDelete: (invite: Invite) => void
  userUpdate: (before: User, after: User) => void
  voiceServerUpdate: (data: VoiceServerUpdateData) => void
  voiceStateAdd: (state: VoiceState) => void
  voiceStateRemove: (state: VoiceState) => void
  voiceStateUpdate: (state: VoiceState, after: VoiceState) => void
  webhooksUpdate: (guild: Guild, channel: GuildTextChannel) => void
}
